import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { TwitterApi } from 'twitter-api-v2'

export async function GET(req: NextRequest) {
  console.log('X API user route called')
  const token = await getToken({ req })
  if (!token) {
    console.log('User not authenticated')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const client = new TwitterApi(process.env.X_BEARER_TOKEN!)
  const username = req.nextUrl.searchParams.get('username')
  const userId = req.nextUrl.searchParams.get('userId')

  if (!username && !userId) {
    console.log('Neither username nor userId provided')
    return NextResponse.json({ error: 'Username or userId is required' }, { status: 400 })
  }

  console.log('Fetching X data for:', userId || username)
  try {
    let user;
    if (userId) {
      console.log('Finding user by ID')
      user = await client.v2.user(userId)
    } else {
      console.log('Finding user by username')
      user = await client.v2.userByUsername(username!)
    }
    console.log('User found:', user.data)

    if (!user.data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Fetching user tweets')
    const tweets = await client.v2.userTimeline(user.data.id, {
      max_results: 10,
      'tweet.fields': ['text', 'created_at']
    })
    console.log('Tweets fetched:', tweets.data)

    const response = {
      recentPosts: tweets.data.data.map((tweet: { text: string }) => tweet.text),
      bio: user.data.description,
      location: user.data.location
    }
    console.log('Prepared response:', response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error fetching X data:', error)
    if (error.code === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Error fetching X data', details: error.message }, { status: 500 })
  }
}
