import { questionnaire } from "../../../data/questionare";

function getQuestionVariation(questionObj) {
  const variations = questionObj.variations || [questionObj.question];
  return variations[Math.floor(Math.random() * variations.length)];
}

function getContextQuote(questionObj) {
  const quotes = questionObj.quotes || ["Find your perfect piece today"];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function parseBudgetInput(input) {
  const normalized = input.toLowerCase().trim();
  
  if (normalized.includes('no budget') || normalized.includes('no limit') || normalized.includes('unlimited')) {
    return { 
      tags: ['under-25k', '25k-50k', '50k-1L', '1L-5L', 'above-5L'], 
      answer: 'Above ₹5L',
      numericValue: 10000000  // 1 crore as unlimited
    };
  }
  
  let numericValue = 0;
  
  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*l(?:akh)?/i);
  if (lakhMatch) {
    numericValue = parseFloat(lakhMatch[1]) * 100000; 
  } else {
    const cleanedNumber = normalized.replace(/[,\s]/g, '');
    
    const kMatch = cleanedNumber.match(/(\d+(?:\.\d+)?)\s*k/i);
    if (kMatch) {
      numericValue = parseFloat(kMatch[1]) * 1000;
    } else {
      const numberMatch = cleanedNumber.match(/(\d+(?:\.\d+)?)/);
      if (numberMatch) {
        numericValue = parseFloat(numberMatch[1]);
      }
    }
  }
  
  // If no valid number found, return a default budget response instead of null
  if (numericValue === 0 || isNaN(numericValue)) {
    return { 
      tags: ['under-25k', '25k-50k', '50k-1L', '1L-5L', 'above-5L'], 
      answer: `Under ${input}`,
      numericValue: 100000  // Default to 1L
    };
  }
  

  const applicableTags = [];
  
  applicableTags.push('under-25k');
  
  if (numericValue > 25000) {
    applicableTags.push('25k-50k');
  }
  
  if (numericValue > 50000) {
    applicableTags.push('50k-1L');
  }
  
  if (numericValue > 100000) {
    applicableTags.push('1L-5L');
  }
  
  if (numericValue > 500000) {
    applicableTags.push('above-5L');
  }
  
  // Format the answer
  let answer = '';
  if (numericValue < 25000) {
    answer = 'Under ₹25k';
  } else if (numericValue < 50000) {
    answer = '₹25k–₹50k';
  } else if (numericValue < 100000) {
    answer = '₹50k–₹1L';
  } else if (numericValue < 500000) {
    answer = '₹1L–₹5L';
  } else {
    answer = 'Above ₹5L';
  }
  
  const formattedValue = numericValue >= 100000 
    ? `₹${(numericValue / 100000).toFixed(2)}L` 
    : numericValue >= 1000 
    ? `₹${(numericValue / 1000).toFixed(0)}k` 
    : `₹${numericValue}`;
  
  return { 
    tags: applicableTags, 
    answer: `${formattedValue} (${answer})`,
    numericValue: numericValue
  };
}

function identifyQuestionFromAssistantMessage(assistantContent) {
  const questionText = assistantContent.toLowerCase();
  
  // Recipient question
  if (questionText.includes("who's the") || 
      questionText.includes("who is this") ||
      questionText.includes("who are you shopping") ||
      questionText.includes("who will be wearing") ||
      questionText.includes("who are you looking") ||
      questionText.includes("recipient") ||
      questionText.includes("gift for") ||
      questionText.includes("shopping for")) {
    return 'recipient';
  }
  
  // Occasion question
  if (questionText.includes("occasion") || 
      questionText.includes("what's this jewelry for") ||
      questionText.includes("celebrating") ||
      questionText.includes("special moment") ||
      questionText.includes("what are you celebrating") ||
      questionText.includes("what brings") ||
      questionText.includes("milestone") ||
      questionText.includes("commemorating")) {
    return 'occasion';
  }
  
  // ENGAGEMENT-SPECIFIC QUESTIONS - Check these BEFORE general questions to avoid conflicts

  // Diamond shape question
  if (questionText.includes("diamond shape") ||
      questionText.includes("shape speaks") ||
      questionText.includes("diamond cut") ||
      questionText.includes("diamond style") ||
      questionText.includes("shape feels right") ||
      questionText.includes("what shape") ||
      (questionText.includes("shape") && (questionText.includes("prefer") || questionText.includes("feels")))) {
    return 'engagement-diamond-shape';
  }

  // Engagement metal tone question - ONLY for engagement rings
  if ((questionText.includes("what metal tone") && questionText.includes("prefer")) ||
      (questionText.includes("gold tone") && questionText.includes("catches your eye")) ||
      (questionText.includes("tone") && questionText.includes("feels right") && questionText.includes("metal"))) {
    return 'engagement-tone-material';
  }
  
  // Jewelry category question
  if (questionText.includes("jewelry category") || 
      questionText.includes("which jewelry") ||
      questionText.includes("type of jewelry") ||
      questionText.includes("kind of jewelry") ||
      questionText.includes("type of piece") ||
      questionText.includes("piece interests") ||
      questionText.includes("what type") ||
      questionText.includes("category appeals") ||
      questionText.includes("what kind of jewelry") ||
      questionText.includes("which type catches") ||
      questionText.includes("what would you like to explore") ||
      questionText.includes("like to explore")) {
    return 'jewelry-category';
  }
  
  // Style preference question
  if (questionText.includes("style vibe") || 
      questionText.includes("style resonates") ||
      questionText.includes("aesthetic") ||
      questionText.includes("vibe feels") ||
      questionText.includes("style preference") ||
      questionText.includes("which look") ||
      questionText.includes("design preference")) {
    return 'style-preference';
  }
  
  // Color preference question - Check BEFORE material question to avoid conflicts
  if (questionText.includes("preferred metal color") ||
      questionText.includes("metal color") ||
      questionText.includes("which metal color") ||
      questionText.includes("what metal color") ||
      questionText.includes("metal shade") ||
      questionText.includes("tone speaks") ||
      questionText.includes("yellow gold") ||
      questionText.includes("rose gold") ||
      questionText.includes("white gold") ||
      questionText.includes("color do you love") ||
      questionText.includes("tone speaks to you") ||
      questionText.includes("shade appeals") ||
      questionText.includes("favorite metal tone") ||
      (questionText.includes("color") && questionText.includes("prefer"))) {
    return 'color-preference';
  }

  // Material/Purity question - Checked AFTER color-preference
  if (questionText.includes("which purity") ||
      questionText.includes("purity do you prefer") ||
      questionText.includes("which karat") ||
      questionText.includes("gold purity") ||
      questionText.includes("which metal") ||
      questionText.includes("metal preference") ||
      questionText.includes("type of metal") ||
      questionText.includes("metal & stone") ||
      questionText.includes("materials speak") ||
      questionText.includes("preferred material") ||
      (questionText.includes("combination") && questionText.includes("feels"))) {
    return 'material';
  }

  // Budget question
  if (questionText.includes("budget") || 
      questionText.includes("price range") || 
      questionText.includes("investment range") || 
      questionText.includes("comfortable spending") ||
      questionText.includes("what range works") ||
      questionText.includes("spending range") ||
      (questionText.includes("range") && questionText.includes("suits")) ||
      questionText.includes("spend")) {
    return 'budget';
  }
  
  return null;
}

function extractTagsFromHistory(history) {
  const collectedTags = [];
  const askedQuestions = [];
  
  for (let i = 0; i < history.length; i++) {
    const msg = history[i];
    
    if (msg.role === 'assistant' && i + 1 < history.length) {
      const userResponse = history[i + 1];
      if (userResponse.role === 'user') {
        const answer = userResponse.content.trim();
        const assistantMsg = history[i];
        const questionText = assistantMsg.content.toLowerCase();
        
        let questionId = null;
        let tag = null;
        
        // Special handling for budget - keep existing parsing logic
        if (questionText.includes('budget') || 
            questionText.includes('price range') || 
            questionText.includes('investment range') ||
            questionText.includes('comfortable spending') ||
            questionText.includes('what range') ||
            questionText.includes('spending range') ||
            (questionText.includes('range') && questionText.includes('works')) ||
            questionText.includes('spend')) {
          
          const budgetParsed = parseBudgetInput(answer);
          if (budgetParsed) {
            questionId = 'budget';
            tag = budgetParsed.tags.join(','); 
            history[i + 1].normalizedAnswer = budgetParsed.answer;
            history[i + 1].budgetTags = budgetParsed.tags; 
          }
        }
        
        // For all other questions, identify the question and just take the answer as-is
        if (!questionId) {
          const identifiedQuestion = identifyQuestionFromAssistantMessage(assistantMsg.content);
          
          if (identifiedQuestion && !askedQuestions.includes(identifiedQuestion)) {
            questionId = identifiedQuestion;
            tag = answer; // Just use the answer directly as the tag
          }
        }
        
        if (questionId && tag) {
          askedQuestions.push(questionId);
          
          const finalAnswer = userResponse.normalizedAnswer || answer;
          
          if (questionId === 'budget' && userResponse.budgetTags) {
            collectedTags.push({
              question: questionId,
              tag: tag, 
              tags: userResponse.budgetTags, 
              answer: finalAnswer,
              userInput: answer
            });
          } else {
            collectedTags.push({
              question: questionId,
              tag: tag,
              answer: finalAnswer,
              userInput: answer
            });
          }
          
          // Special handling: If occasion is "Engagement", automatically add jewelry-category as "rings"
          if ((questionId === 'occasion' || questionId === 'occasion1') && 
              answer.toLowerCase().includes('engagement') &&
              !askedQuestions.includes('jewelry-category')) {
            askedQuestions.push('jewelry-category');
            collectedTags.push({
              question: 'jewelry-category',
              tag: 'rings',
              answer: 'Rings',
              userInput: 'rings'
            });
          }
        }
      }
    }
  }
  
  return { collectedTags, askedQuestions };
}

function extractAllTags(collectedTags) {
  const allTags = [];
  for (const item of collectedTags) {
    if (item.question === 'budget' && item.tags) {
      // Expand budget tags
      allTags.push(...item.tags);
    } else {
      allTags.push(item.tag);
    }
  }
  return allTags;
}

function decideNextQuestion(collectedTags, askedQuestions) {
  const isEngagement = collectedTags.some(t => t.tag === "engagement");
  
  // Safety check: Never ask budget if it's already been asked
  const budgetAlreadyAsked = askedQuestions.includes("budget");
  
  if (isEngagement) {
    if (!askedQuestions.includes("engagement-diamond-shape")) {
      return { nextQuestionId: "engagement-diamond-shape", reasoning: "Engagement flow: diamond shape", needsMoreContext: true };
    }
    if (!askedQuestions.includes("engagement-tone-material")) {
      return { nextQuestionId: "engagement-tone-material", reasoning: "Engagement flow: metal tone", needsMoreContext: true };
    }
    if (!budgetAlreadyAsked) {
      return { nextQuestionId: "budget", reasoning: "Engagement flow: budget", needsMoreContext: true };
    }
    return { nextQuestionId: null, reasoning: "Engagement flow complete", needsMoreContext: false };
  }
  
  const questionFlow = [
    "recipient",
    "occasion",
    "style-preference",
    "jewelry-category",
    "material",
    "color-preference",
    "budget"
  ];
  
  for (const qId of questionFlow) {
    if (qId === "occasion" && askedQuestions.includes("occasion1")) {
      continue;
    }
    // Skip budget if it's already been asked
    if (qId === "budget" && budgetAlreadyAsked) {
      continue;
    }
    if (!askedQuestions.includes(qId)) {
      return { nextQuestionId: qId, reasoning: `Next in flow: ${qId}`, needsMoreContext: true };
    }
  }
  
  if (budgetAlreadyAsked) {
    return { nextQuestionId: null, reasoning: "Flow complete with budget", needsMoreContext: false };
  }
  
  if (collectedTags.length >= 3 && !budgetAlreadyAsked) {
    return { nextQuestionId: "budget", reasoning: "Final question: budget", needsMoreContext: true };
  }
  
  return { nextQuestionId: null, reasoning: "Flow complete", needsMoreContext: false };
}

export async function POST(req) {
  try {
    const { history = [] } = await req.json();

    if (history.length === 0) {
      const questionVariation = getQuestionVariation(questionnaire.recipient);
      const contextQuote = getContextQuote(questionnaire.recipient);
      
      return Response.json({
        status: "asking",
        question: questionVariation,
        options: questionnaire.recipient.options.map(opt => ({
          label: opt.label,
          tag: opt.tag,
          src: opt.src || null
        })),
        contextquote: contextQuote,
        aiReasoning: "Starting the conversation - asking about the recipient",
        progress: {
          answered: 0,
          asked: 0
        }
      });
    }

    const { collectedTags, askedQuestions } = extractTagsFromHistory(history);

    // Safety check: If budget has already been asked, mark flow as complete
    const budgetAlreadyAnswered = askedQuestions.includes("budget");
    
    const isEngagementFlow = collectedTags.some(t => 
      t.tag === "engagement" || 
      (t.question === "occasion" && t.answer && t.answer.toLowerCase().includes("engagement")) ||
      (t.question === "occasion1" && t.answer && t.answer.toLowerCase().includes("engagement"))
    );

    if (isEngagementFlow) {
      const budgetAsked = askedQuestions.includes("budget");
      
      if (budgetAsked) {
        return Response.json({
          status: "complete",
          tags: extractAllTags(collectedTags),
          details: collectedTags,
          aiReasoning: "Engagement flow completed - all required questions answered",
          summary: {
            totalQuestions: collectedTags.length,
            recipient: collectedTags.find(t => t.question === "recipient")?.answer,
            occasion: collectedTags.find(t => t.question === "occasion" || t.question === "occasion1")?.answer,
            diamondShape: collectedTags.find(t => t.question === "engagement-diamond-shape")?.answer,
            toneMaterial: collectedTags.find(t => t.question === "engagement-tone-material")?.answer,
            budget: collectedTags.find(t => t.question === "budget")?.answer,
          }
        });
      }

      const diamondShapeAsked = askedQuestions.includes("engagement-diamond-shape");
      const toneMaterialAsked = askedQuestions.includes("engagement-tone-material");

      if (!diamondShapeAsked && askedQuestions.length >= 2) {
        const nextQuestion = questionnaire["engagement-diamond-shape"];
        const questionVariation = getQuestionVariation(nextQuestion);
        const contextQuote = getContextQuote(nextQuestion);

        return Response.json({
          status: "asking",
          question: questionVariation,
          options: nextQuestion.options.map(opt => ({
            label: opt.label,
            tag: opt.tag,
            src: opt.src || null
          })),
          contextquote: contextQuote,
          aiReasoning: "Engagement flow: asking about preferred diamond shape",
          progress: {
            answered: collectedTags.length,
            asked: askedQuestions.length
          }
        });
      }

      if (diamondShapeAsked && !toneMaterialAsked) {
        const nextQuestion = questionnaire["engagement-tone-material"];
        const questionVariation = getQuestionVariation(nextQuestion);
        const contextQuote = getContextQuote(nextQuestion);

        return Response.json({
          status: "asking",
          question: questionVariation,
          options: nextQuestion.options.map(opt => ({
            label: opt.label,
            tag: opt.tag,
            src: opt.src || null
          })),
          contextquote: contextQuote,
          aiReasoning: "Engagement flow: asking about preferred metal tone",
          progress: {
            answered: collectedTags.length,
            asked: askedQuestions.length
          }
        });
      }

      if (toneMaterialAsked && !budgetAsked) {
        const nextQuestion = questionnaire["budget"];
        const questionVariation = getQuestionVariation(nextQuestion);
        const contextQuote = getContextQuote(nextQuestion);

        return Response.json({
          status: "asking",
          question: questionVariation,
          options: nextQuestion.options.map(opt => ({
            label: opt.label,
            tag: opt.tag,
            src: opt.src || null
          })),
          contextquote: contextQuote,
          aiReasoning: "Engagement flow: asking about budget",
          progress: {
            answered: collectedTags.length,
            asked: askedQuestions.length
          }
        });
      }
    }

    // If budget has been answered and we have enough questions, complete the flow
    if (budgetAlreadyAnswered && collectedTags.length >= 4) {
      return Response.json({
        status: "complete",
        tags: extractAllTags(collectedTags),
        details: collectedTags,
        aiReasoning: "Flow complete - budget answered",
        summary: {
          totalQuestions: collectedTags.length,
          recipient: collectedTags.find(t => t.question === "recipient")?.answer,
          occasion: collectedTags.find(t => t.question === "occasion")?.answer,
          style: collectedTags.find(t => t.question === "style-preference")?.answer,
          category: collectedTags.find(t => t.question === "jewelry-category")?.answer,
          budget: collectedTags.find(t => t.question === "budget")?.answer,
          toneMaterial: collectedTags.find(t => t.question === "engagement-tone-material")?.answer,
        }
      });
    }

    const decision = decideNextQuestion(collectedTags, askedQuestions);
    
    if (!decision.nextQuestionId || !decision.needsMoreContext) {
      return Response.json({
        status: "complete",
        tags: extractAllTags(collectedTags),
        details: collectedTags,
        aiReasoning: decision.reasoning,
        summary: {
          totalQuestions: collectedTags.length,
          recipient: collectedTags.find(t => t.question === "recipient")?.answer,
          occasion: collectedTags.find(t => t.question === "occasion" || t.question === "occasion1")?.answer,
          style: collectedTags.find(t => t.question === "style-preference")?.answer,
          category: collectedTags.find(t => t.question === "jewelry-category")?.answer,
          budget: collectedTags.find(t => t.question === "budget")?.answer,
          diamondShape: collectedTags.find(t => t.question === "engagement-diamond-shape")?.answer,
          toneMaterial: collectedTags.find(t => t.question === "engagement-tone-material")?.answer,
        }
      });
    }
    
    const nextQuestionId = decision.nextQuestionId;
    
    const nextQuestion = questionnaire[nextQuestionId];

    if (!nextQuestion) {
      return Response.json(
        { error: "Invalid question ID from AI", questionId: nextQuestionId },
        { status: 500 }
      );
    }

    const questionVariation = getQuestionVariation(nextQuestion);
    const contextQuote = getContextQuote(nextQuestion);

    return Response.json({
      status: "asking",
      question: questionVariation,
      options: nextQuestion.options.map(opt => ({
        label: opt.label,
        tag: opt.tag,
        src: opt.src || null
      })),
      contextquote: contextQuote,
      aiReasoning: decision.reasoning,
      progress: {
        answered: collectedTags.length,
        asked: askedQuestions.length
      }
    });

  } catch (error) {
    console.error("Jewelry flow error:", error);
    return Response.json(
      { error: "Failed to process jewelry flow", details: error.message },
      { status: 500 }
    );
  }
}
