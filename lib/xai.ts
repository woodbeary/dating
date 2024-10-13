import { OpenAI } from 'openai'

const xai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY,
  dangerouslyAllowBrowser: true,
  baseURL: 'https://api.x.ai/v1',
})

export default xai
