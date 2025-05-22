type MeResponse = {
    data?: {
      me?: {
        id: string
        email: string
        name?: string
      }
    }
  }
  
  export default defineEventHandler(async (event) => {
    console.log("defineEventHandler called")
    const token = getCookie(event, 'token')
    console.log('tokennn', token)
    if (!token) return null
  
    try {
      const server = useRuntimeConfig().public.server
        console.log('server', server)
  
      const response = await $fetch<MeResponse>(`${server}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: `token=${token}`,
        },
        body: {
          query: `
            query Me {
              me {
                id
                email
                name
              }
            }
          `,
        },
      })
        console.log('response', response)
  
      return response.data?.me ?? null
    } catch {
      return null
    }
  })
  