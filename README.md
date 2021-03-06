# Attendance calculator
A comprehensive attendance calculator that helped me plan my days off last year.

The back-end of this code was designed using PHP/cURL. The backend fetched the data from the student portal and displayed it as a table. Unfortunately, I cannot upload the backend code of this project as it needs to be connected to the intranet to work. It just seems pointless trying to use it from anywhere else, really. This PHP script accepted the username and password from the user and passed it on to the student portal endpoint (which soon had a captcha <s>that was easy to bypass</s>). I used an <a href='http://simplehtmldom.sourceforge.net'>HTML parsing library</a> to extract attendance information and display it as a table.

I used JavaScript/jQuery to dynamically generate tables and the compute the attendance. CSS to make it look good. Twitter Bootstrap too, obviously.

This page is just a static dump of what was generated by the PHP script (I saved the webpage). Most of the JavaScript functions still work, but some are obsolete.

#How to use:
Real easy. 

<ul>
<li>Just click any cell on the table, say "IT0480" on "Wed, 2015-04-01" and watch it turn red. </li>
<li>If you're feeling adventurous and wish to cut class for a whole day, click the "Bunk" button and watch the whole row turn red.</li>
<li>If you have a change of heart and wish to attend a "red" class, just click it again and watch it turn blue.</li>
<li>When you're done picking out your schedule, click the Date under the date column (say "Fri, 2015-04-10"). You will see how your attendance changes after you've picked your schedule between "Tue, 2015-03-31" and "Fri, 2015-04-10". You can just as easily pick any other date too.</li>
</ul>

#Things to note
<ul>
<li>This snapshot was saved during my final year, so I had a lot of free time, evidenced by the "blanks" in my schedule. This timetable looked a lot better and was a lot more useful with a "fuller" timetable, but unfortunately, I did not save a copy of the page back then. I could just pad the schedule with filler classes, but it I believe that 4 courses are enough to highlight the working of this calculator.</li>
<li>"Day order" was to ensure that classes were not "lost" for a whole week in the rare occurrence of a holiday. If Friday was a holiday, Monday would have Friday's schedule, Tuesday would have Monday's and so on. Think of it as a (Working day)%5 counter.</li>
</ul>

This is how the page looks: <a href='https://rawgit.com/AkshayRaman/attendance-calculator/master/index.html'>Click here</a>
