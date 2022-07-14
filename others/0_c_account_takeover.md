---
layout: post
date: 2022-7-14 -0500
title: Zero Click Account Takeover BB Writeup
author: Devang-Solanki
---

So, this is my first writeup on a bug which i found on a private program on hackerone and also my first critical bug.

## Mindset 
The application I was testing was very similar to myntra where people could buy clothes and rate clothes. I found several low severity bugs like race condition on liking functionality of products. This web app has very limited functionality, so I shifted my focus to the authentication flow.

On this web app we have two ways to signup one was traditional where we have to provide a password and email; the other was to sign up using just an email. The second method caught my attention.

## Testing
In second method, just by providing our email, the account was getting created at backend without any password and to set a password we either have to set password just after signing up or to click on forgot password to send a reset password link to the registered mail.

I tried logging in without setting the password and I was presented with the new endpoint called send magic link to login. On clicking the button the following request was being sent to the backend (Obviously with some cookies and trackers which i removed from the original request).

```http
POST /api/v1.0/magic_links HTTP/2
Host: www.redacted.com
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/json
Content-Length: 93
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
Te: trailers

{"email":"devangsolanki@wearehackerone.com","subject":"magic_link","visitor_id":"3118975949"}
```

In the above request the visitor_id parameter caught my attention and I tried to figure out, what the heck is this. On looking at the request closely in burp, i found that it's one of the cookie values. By testing I found out that this cookie is being assigned to browser and is being tied with login session of the user. One browser had only one visitor_id and different browser had different. 

When I forwarded the request, I got one magic link in my mail, and when I clicked on it, I got logged in to a different account. Weird no!! After looking around I found the reason as I was using firefox multi-container, I had two accounts running on the same browser with same visitor_id. So I thought what if I change visitor_id with the one where an account is already logged in. On doing this I was able to login to that account.

Since the visitor_id parameter was very long, I couldn't report it. But it was very guessy; for example, it always starts with "31189" and after this every thing was random, plus it does not have any rate limit enforced, so I was able to bruteforce visitor_id and could be able to login to any random account via the magic link sent to my email.

## Every story need not have a happy ending. 
I reported this bug and was expecting a good amount of bounty and slept. I reported this bug on 10th Feb and got a reply from hackerone triager on 14th Feb, and they replied with "I'm discussing this submission internally with the Reacted BBP team. You will be updated as soon as there is additional information to share. Thanks for your patience!". After this I waited for the reply.

After 15 days another triager from the hackerone team joined the report and asked me to reproduce the bug. So logged in to my Kali machine and tried to reproduce it, and found out that the endpoint is not behaving as expected, and it has been changed. I told the triager that it has been fixed by the team. After many days without any reply, I opted for hackerone mediation in hope of getting help, but they also couldn't help.

After a month I got a reply from the team and was very disappointed by how companies treat bug bounty hunters. Below is a snapshot.
![image](/images/0_c_account_takeover/chat_snapshot.jpg)
