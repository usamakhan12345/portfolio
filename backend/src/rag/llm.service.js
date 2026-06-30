/**
 * Local & Cloud Response Generator
 * Integrates Google Gemini API for live context-aware completions,
 * and falls back to a heuristic NLP parser if the API key is not defined.
 */

/**
 * Generate context-aware response using Gemini API or offline matching templates.
 * @param {string} userQuery - Input query from the user
 * @param {string} context - Retrieved text chunks from uploaded documents
 * @returns {Promise<string>} Conversational response text
 */
const generateResponse = async (userQuery, context) => {
  // 1. Intercept standard greetings immediately at startup
  const queryText = userQuery.toLowerCase().trim();
  const greetings = ['hi', 'hello', 'hey', 'hy', 'yo', 'hii', 'hyy', 'heyy', 'hola'];
  if (greetings.some(g => queryText === g || queryText.startsWith(g + ' ') || queryText.endsWith(' ' + g))) {
    return "Hello! I am Usama's portfolio assistant. Feel free to ask me about his **MERN Stack skills**, **projects**, or **contact details**!";
  }

  const apiKey = process.env.GEMINI_API_KEY || '';

  // 2. If Gemini API key is configured, query Gemini 1.5 Flash
  if (apiKey) {
    try {
      console.log('[LLMService] Invoking Google Gemini 1.5 Flash API');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const systemPrompt = `You are an AI Chatbot representative on Usama's professional developer portfolio website.
Your job is to answer questions about Usama's skills, experience, projects, and availability.
Be helpful, professional, polite, and brief. Use markdown where helpful.

Here is some retrieved relevant context from Usama's database to help you answer (use it if relevant):
${context || 'No specific context retrieved.'}

If the context does not contain the answer, reply to the best of your general ability, but recommend the user to contact Usama directly via his contact form or WhatsApp button if it's a specific personal question.`;

      const result = await model.generateContent([
        { text: systemPrompt },
        { text: `User Query: ${userQuery}` }
      ]);
      
      if (result && result.response) {
        const responseText = result.response.text();
        return responseText.trim();
      }
    } catch (apiError) {
      console.error(`❌ Gemini API Error, falling back to local NLP heuristics: ${apiError.message}`);
    }
  }

  // 3. Local Offline NLP heuristics fallback
  console.log('[LLMService] Processing response offline using local text match templates');
  const query = userQuery.toLowerCase();
  
  if (context && context.trim().length > 0) {
    const cleanContext = context.replace(/[•\t\r\v]/g, ',').replace(/\s+/g, ' ').trim();
    
    // Intent A: Education & Qualifications
    if (
      query.includes('qualification') || 
      query.includes('education') || 
      query.includes('degree') || 
      query.includes('university') || 
      query.includes('study') || 
      query.includes('graduat') || 
      query.includes('course')
    ) {
      const hasFuuast = cleanContext.toLowerCase().includes('fuuast');
      const hasBachelor = cleanContext.toLowerCase().includes('bachelor');
      const hasCert = cleanContext.toLowerCase().includes('technyx') || cleanContext.toLowerCase().includes('hybrid');

      let reply = "";
      if (hasFuuast && hasBachelor) {
        reply += "- 🎓 **Education**: He holds a **Bachelor of Science in Computer Science** from **Fuuast University** (Completed in 2024).\n";
      }
      if (hasCert) {
        reply += "- 📜 **Certification**: He has completed a professional training course in **Web & Mobile Hybrid App Development** at Technyx System.\n";
      }
      
      if (!hasFuuast && !hasCert) {
        const eduSentences = cleanContext.split(/[.!?\n]/).filter(s => 
          s.toLowerCase().includes('university') || 
          s.toLowerCase().includes('degree') || 
          s.toLowerCase().includes('school') ||
          s.toLowerCase().includes('education') ||
          s.toLowerCase().includes('certified')
        );
        if (eduSentences.length > 0) {
          reply += eduSentences.slice(0, 3).map(s => `- ${s.trim()}`).join('\n') + '\n';
        } else {
          reply += "I found references to his educational background in the documents, which details his computer science studies and certifications.";
        }
      }
      return reply;
    }

    // Intent B: Experience & Professional Profile
    if (
      query.includes('experience') || 
      query.includes('year') || 
      query.includes('work') || 
      query.includes('job') || 
      query.includes('profile') || 
      query.includes('history') ||
      query.includes('position')
    ) {
      const has2Years = cleanContext.toLowerCase().includes('2+') || cleanContext.toLowerCase().includes('2 years');
      const hasDev = cleanContext.toLowerCase().includes('developer') || cleanContext.toLowerCase().includes('engineer');

      let reply = "";
      if (has2Years && hasDev) {
        reply += "Usama is a **Software Developer** with **2+ years of professional experience** building and maintaining responsive websites and application interfaces in the IT industry.\n";
      } else {
        const expSentences = cleanContext.split(/[.!?\n]/).filter(s => 
          s.toLowerCase().includes('experience') || 
          s.toLowerCase().includes('year') || 
          s.toLowerCase().includes('developer') ||
          s.toLowerCase().includes('worked')
        );
        if (expSentences.length > 0) {
          reply += expSentences.slice(0, 3).map(s => `- ${s.trim()}`).join('\n') + '\n';
        } else {
          reply += "The documents indicate that he is an experienced JavaScript developer specializing in front-end and full-stack MERN configurations.";
        }
      }
      return reply;
    }

    // Intent C: Skills & Technologies
    if (
      query.includes('skill') || 
      query.includes('tech') || 
      query.includes('expert') || 
      query.includes('language') || 
      query.includes('framework') || 
      query.includes('know')
    ) {
      const skills = [];
      const matchTerms = ['react', 'next.js', 'typescript', 'javascript', 'node', 'express', 'mongodb', 'redux', 'git', 'gitlab', 'github', 'html5', 'css3'];
      
      matchTerms.forEach(term => {
        if (cleanContext.toLowerCase().includes(term)) {
          skills.push(term.charAt(0).toUpperCase() + term.slice(1));
        }
      });

      if (skills.length > 0) {
        return `According to Usama's resume, his core technical skills and expertise include:

💻 **${skills.join(', ')}**

He is proficient in building robust front-end interfaces, integrating RESTful APIs, and developing complete full-stack web applications.`;
      }
    }

    // Intent E: Project Links, Code Repos, and Live Demos
    if (
      query.includes('link') || 
      query.includes('github') || 
      query.includes('url') || 
      query.includes('demo') || 
      query.includes('website') || 
      query.includes('repo') || 
      query.includes('source') ||
      query.includes('portfoli')
    ) {
      return `Here are the key links to Usama's projects and code repositories:

- 🌐 **Dubai Department of Economy and Tourism – Learning Hub**: [Live Website](https://dubailearns.me)
- 🤖 **AI Conversational Dashboard**: [GitHub Code](https://github.com) | [Live Demo](https://example.com)
- 🛒 **Futuristic E-Commerce Platform**: [GitHub Code](https://github.com) | [Live Demo](https://example.com)
- 📊 **Real-Time Analytics Suite**: [GitHub Code](https://github.com) | [Live Demo](https://example.com)
- ☁️ **SaaS Cloud Storage Hub**: [GitHub Code](https://github.com) | [Live Demo](https://example.com)

*(Note: Some links are placeholder templates that you can customize with your actual project domains).*`;
    }

    // Intent D: Contact Info
    if (
      query.includes('contact') || 
      query.includes('phone') || 
      query.includes('email') || 
      query.includes('reach') || 
      query.includes('number') || 
      query.includes('whatsapp')
    ) {
      const email = cleanContext.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phone = cleanContext.match(/\+?[0-9]{2,3}-?[0-9]{3}-?[0-9]{6,7}/g);
      
      let reply = "";
      if (email) {
        reply += `- 📧 **Email**: [${email[0]}](mailto:${email[0]})\n`;
      } else {
        reply += `- 📧 **Email**: shehzadausamakhan@gmail.com\n`;
      }
      if (phone && phone.length > 0) {
        reply += `- 📞 **Phone**: ${phone.join(' / ')}\n`;
      } else {
        reply += `- 📞 **Phone**: +92-316-2920295\n`;
      }
      return reply;
    }

    // Fallback: General Question - parse sentences, filter garbage, format cleanly
    const contextWithoutSources = cleanContext.replace(/\[Source: [^\]]+\]/gi, '');
    const sentences = contextWithoutSources
      .split(/[.!?•\n]/)
      .map(s => s.trim())
      .filter(s => {
        const lower = s.toLowerCase();
        if (s.length < 20) return false;
        if (lower.includes('http') || lower.includes('www') || lower.includes('github') || lower.includes('linkedin') || lower.includes('instagram')) return false;
        if (lower.includes('@') || lower.includes('+92') || lower.includes('phone') || lower.includes('email:')) return false;
        if (lower.includes('.pdf') || lower.includes('.txt') || lower.includes('.docx') || lower.includes('.md')) return false;
        if (s.split(/\s+/).length < 4) return false;
        return true;
      });

    if (sentences.length > 0) {
      const queryTokens = query.split(/\s+/).filter(t => t.length > 3);
      const matched = sentences.filter(s => 
        queryTokens.some(token => s.toLowerCase().includes(token))
      );

      const finalSentences = matched.length > 0 ? matched : sentences.slice(0, 3);
      
      return `Here are the relevant details from the uploaded documents:

${finalSentences.map(s => `- ${s}.`).join('\n')}`;
    }
  }

  // 4. Default Conversational replies (if no context matching)
  if (query.includes('skill') || query.includes('tech') || query.includes('expert') || query.includes('know')) {
    return "Usama is a **MERN Stack Software Engineer** specializing in:\n- **Frontend**: React, JavaScript (ES6+), custom SCSS styling (Variables, Mixins), Framer Motion, Swiper\n- **Backend**: Node.js, Express, REST APIs, Multer, Text-parsing pipelines\n- **Databases**: MongoDB & Mongoose schemas";
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('whatsapp') || query.includes('reach')) {
    return "You can get in touch with Usama directly:\n- **Email**: [shehzadausamakhan@gmail.com](mailto:shehzadausamakhan@gmail.com)\n- **Phone/WhatsApp**: [03162920295](tel:03162920295)\n- Or simply click the green **WhatsApp icon** floating in the corner to chat!";
  }

  if (query.includes('project') || query.includes('work') || query.includes('code')) {
    return "Usama has built several premium full-stack applications, such as a covers-focused Projects Slider, full E-Commerce portals, real-time developer dashboards, and collaborative boards. Scroll to the **Projects** section to view them!";
  }

  if (query.includes('resume') || query.includes('cv') || query.includes('experience')) {
    return "You can view Usama's timeline in the **About** section or download his complete resume directly from the **Resume** section by clicking the download action button.";
  }

  return `I couldn't find any matching details for **"${userQuery}"**. 
  
Try asking about Usama's **skills**, **projects**, or **contact details**!`;
};

module.exports = {
  generateResponse
};
