import { OpenRouter } from '@openrouter/sdk'

const model = 'google/gemini-2.0-flash-001'

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const getOpenRouterClient = () => {
  const apiKey = (process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY || '').trim()
  
  if (!apiKey || apiKey.includes('your_openrouter_api_key_here')) {
    return null
  }

  // OpenRouter SDK (Speakeasy-generated) constructor options
  return new OpenRouter({
    apiKey,
    httpReferer: 'https://finance-ai.local',
    appTitle: 'FinanceAI - Personal Financial Advisor',
  })
}

export const getAICompletion = async (messages: AIMessage[]) => {
  const client = getOpenRouterClient()
  
  if (!client) {
    return "I'm currently in demo mode. Please set a valid OPENROUTER_API_KEY in the server/.env file to enable my full intelligence! 🧠"
  }

  try {
    // The Speakeasy-generated SDK uses a nested 'chatGenerationParams' structure
    const response = await client.chat.send({
      chatGenerationParams: {
        model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: false,
        temperature: 0.7,
      }
    })

    // The response is also nested differently in this SDK version
    // Check if it's a direct response or an operations result
    if ('choices' in response) {
      return response.choices[0].message.content
    }
    
    // Fallback if the response type is SendChatCompletionRequestResponse
    return (response as any).data?.choices?.[0]?.message?.content || "AI is thinking... please try again."
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message)
    throw new Error('Failed to communicate with AI Advisor.')
  }
}

export const buildSystemPrompt = (context: {
  userName?: string
  profession?: string
  currency: string
  totalBudget: string
  spentAmount: string
  recentTransactions: any[]
}) => {
  return `You are "FinanceAI Advisor", a friendly and highly expert personal financial consultant specialized in the Bangladeshi (BDT) market.

USER CONTEXT:
- Name: ${context.userName || 'User'}
- Profession: ${context.profession || 'Not specified'}
- Currency: ${context.currency} (৳)
- Monthly Income/Budget: ${context.totalBudget}
- Total Spent This Month: ${context.spentAmount}

RECENT TRANSACTIONS:
${context.recentTransactions.map(tx => `- ${tx.transactionDate}: ${tx.type === 'income' ? '+' : '-'}${tx.amount} (${tx.category?.name}) - ${tx.description}`).join('\n')}

GUIDELINES:
1. Always be empathetic and data-driven.
2. Use the 50/30/20 rule (Needs/Wants/Savings) as your primary framework.
3. Reference the user's specific categories (e.g., "Food & Groceries", "Housing") in your advice.
4. If a user is overspending in a category, provide actionable tips to cut back.
5. Focus on the Bangladeshi context (e.g., mention local savings instruments like DPS, Sanchaypatra, or local market trends if relevant).
6. Keep responses concise and formatted with GitHub markdown (bullet points, bold text).
7. If asked about investments, provide general tips based on their medium risk tolerance, but always add a disclaimer that this is not professional financial advice.`
}

export const buildReportPrompt = (context: {
  userName?: string
  profession?: string
  currency: string
  totalBudget: number
  totalSpent: number
  categoryTotals: any[]
}) => {
  const needs = context.categoryTotals.filter(c => c.category?.type === 'need').reduce((s, c) => s + parseFloat(c.spentAmount), 0)
  const wants = context.categoryTotals.filter(c => c.category?.type === 'want').reduce((s, c) => s + parseFloat(c.spentAmount), 0)
  const savings = context.categoryTotals.filter(c => c.category?.type === 'saving' || c.category?.type === 'investment').reduce((s, c) => s + parseFloat(c.spentAmount), 0)
  
  const remaining = context.totalBudget - context.totalSpent
  const savingsRate = context.totalBudget > 0 ? ((context.totalBudget - context.totalSpent) / context.totalBudget) * 100 : 0

  return `You are "FinanceAI Senior Analyst". Generate a comprehensive Monthly Financial Health Report for ${context.userName || 'the user'}.

FINANCIAL SNAPSHOT (BDT - ৳):
- Total Monthly Income: ${context.totalBudget}
- Total Expenses: ${context.totalSpent}
- Remaining Balance: ${remaining}
- Current Savings Rate: ${savingsRate.toFixed(1)}%

50/30/20 BREAKDOWN:
- Needs (Target 50%): ${((needs / (context.totalBudget || 1)) * 100).toFixed(1)}% (${needs} ৳)
- Wants (Target 30%): ${((wants / (context.totalBudget || 1)) * 100).toFixed(1)}% (${wants} ৳)
- Savings/Debt (Target 20%): ${((savings / (context.totalBudget || 1)) * 100).toFixed(1)}% (${savings} ৳)

CATEGORY HIGHLIGHTS:
${context.categoryTotals.map(c => `- ${c.category?.name}: Spent ${c.spentAmount} ৳ (Allocated: ${c.allocatedAmount} ৳)`).join('\n')}

REPORT STRUCTURE (Markdown Required):
1. **Executive Summary**: A high-level overview of the month's financial health.
2. **50/30/20 Analysis**: Evaluation of their adherence to the rule.
3. **Saving & Investment Strategies**: 
    - Suggest specific BDT instruments (e.g., Sanchaypatra, DPS, Local Mutual Funds, Stocks on DSE).
    - Provide 3 levels of risk: Low (Safe), Medium (Balanced), High (Aggressive).
4. **Income Optimization (Earning More)**:
    - Based on their profession (${context.profession || 'Not specified'}), suggest ways to increase income in the local market (e.g., freelancing, side hustles, skill certifications relevant to Bangladesh).
5. **Action Plan for Next Month**: 3-5 concrete steps to improve financial standing.

TONE: Professional, encouraging, and highly specific to the Bangladeshi market. Use bold text for key numbers.`
}

export const generateMonthlyReport = async (promptContent: string) => {
  const client = getOpenRouterClient()
  
  if (!client) {
    return "Demo Mode: AI Reports require a valid OpenAI/Gemini API key. Set OPENROUTER_API_KEY in server/.env to see a full financial analysis! 🧠"
  }

  try {
    const response = await client.chat.send({
      chatGenerationParams: {
        model,
        messages: [{ role: 'system', content: promptContent }],
        stream: false,
        temperature: 0.8,
      }
    })

    if ('choices' in response) {
      return response.choices[0].message.content
    }
    
    return (response as any).data?.choices?.[0]?.message?.content || "AI report generated (check dashboard)."
  } catch (error: any) {
    console.error('Report Generation Error:', error.response?.data || error.message)
    throw new Error('Failed to generate monthly report.')
  }
}
