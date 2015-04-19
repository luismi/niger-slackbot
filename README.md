# ingress-slack

A small collection of hubot-slack scripts for Ingress teams

 * cycle.js: displays checkpoint times
 * link.js: calculates portal linkability and optimal portal builds
 * mu.js: calculates MU required to win a cycle
 * passcode.js: generates bogus passcodes

To use, just drop the scripts you like into your hubot's scripts directory. If any dependencies
are listed in the script, be sure to add them to your hubot's package.json.

## cycle.js

A hubot-slack script to display checkpoint times

### Commands

 * [timezone (optional)] checkpoints|cycle [date (optional)]

### Notes

View the source to update the default timezone, as well as shortcuts for timezone names.

### Examples

    bot cycle

>  1   Sun, Apr 12, 2015 @ 1pm EDT   
2   Sun, Apr 12, 2015 @ 6pm EDT   
3   Sun, Apr 12, 2015 @ 11pm EDT   
4   Mon, Apr 13, 2015 @ 4am EDT   
5   Mon, Apr 13, 2015 @ 9am EDT   
6   Mon, Apr 13, 2015 @ 2pm EDT   
7   Mon, Apr 13, 2015 @ 7pm EDT   
8   Tue, Apr 14, 2015 @ 12am EDT   
9   Tue, Apr 14, 2015 @ 5am EDT   
10   Tue, Apr 14, 2015 @ 10am EDT   
11   Tue, Apr 14, 2015 @ 3pm EDT   
12   Tue, Apr 14, 2015 @ 8pm EDT   
13   Wed, Apr 15, 2015 @ 1am EDT   
14   Wed, Apr 15, 2015 @ 6am EDT   
15   Wed, Apr 15, 2015 @ 11am EDT   
16   Wed, Apr 15, 2015 @ 4pm EDT   
17   Wed, Apr 15, 2015 @ 9pm EDT   
18   Thu, Apr 16, 2015 @ 2am EDT   
19   Thu, Apr 16, 2015 @ 7am EDT   
20   Thu, Apr 16, 2015 @ 12pm EDT   
21   Thu, Apr 16, 2015 @ 5pm EDT   
22   Thu, Apr 16, 2015 @ 10pm EDT   
23   Fri, Apr 17, 2015 @ 3am EDT   
24   Fri, Apr 17, 2015 @ 8am EDT   
25   Fri, Apr 17, 2015 @ 1pm EDT   
26   Fri, Apr 17, 2015 @ 6pm EDT   
27   Fri, Apr 17, 2015 @ 11pm EDT   
28   Sat, Apr 18, 2015 @ 4am EDT   
29   Sat, Apr 18, 2015 @ 9am EDT   
30   Sat, Apr 18, 2015 @ 2pm EDT   
31   Sat, Apr 18, 2015 @ 7pm EDT   
32   Sun, Apr 19, 2015 @ 12am EDT   
33   Sun, Apr 19, 2015 @ 5am EDT   
34   Sun, Apr 19, 2015 @ 10am EDT   
35   Sun, Apr 19, 2015 @ 3pm EDT   

    bot central cycle 10/7/15

> 1   Sun, Oct 4, 2015 @ 12pm CDT   
2   Sun, Oct 4, 2015 @ 5pm CDT   
3   Sun, Oct 4, 2015 @ 10pm CDT   
4   Mon, Oct 5, 2015 @ 3am CDT   
5   Mon, Oct 5, 2015 @ 8am CDT   
6   Mon, Oct 5, 2015 @ 1pm CDT   
7   Mon, Oct 5, 2015 @ 6pm CDT   
8   Mon, Oct 5, 2015 @ 11pm CDT   
9   Tue, Oct 6, 2015 @ 4am CDT   
10   Tue, Oct 6, 2015 @ 9am CDT   
11   Tue, Oct 6, 2015 @ 2pm CDT   
12   Tue, Oct 6, 2015 @ 7pm CDT   
13   Wed, Oct 7, 2015 @ 12am CDT   
14   Wed, Oct 7, 2015 @ 5am CDT   
15   Wed, Oct 7, 2015 @ 10am CDT   
16   Wed, Oct 7, 2015 @ 3pm CDT   
17   Wed, Oct 7, 2015 @ 8pm CDT   
18   Thu, Oct 8, 2015 @ 1am CDT   
19   Thu, Oct 8, 2015 @ 6am CDT   
20   Thu, Oct 8, 2015 @ 11am CDT   
21   Thu, Oct 8, 2015 @ 4pm CDT   
22   Thu, Oct 8, 2015 @ 9pm CDT   
23   Fri, Oct 9, 2015 @ 2am CDT   
24   Fri, Oct 9, 2015 @ 7am CDT   
25   Fri, Oct 9, 2015 @ 12pm CDT   
26   Fri, Oct 9, 2015 @ 5pm CDT   
27   Fri, Oct 9, 2015 @ 10pm CDT   
28   Sat, Oct 10, 2015 @ 3am CDT   
29   Sat, Oct 10, 2015 @ 8am CDT   
30   Sat, Oct 10, 2015 @ 1pm CDT   
31   Sat, Oct 10, 2015 @ 6pm CDT   
32   Sat, Oct 10, 2015 @ 11pm CDT   
33   Sun, Oct 11, 2015 @ 4am CDT   
34   Sun, Oct 11, 2015 @ 9am CDT   
35   Sun, Oct 11, 2015 @ 2pm CDT

## link.js

A hubot-slack script to calculate portal linkability, including:

 * link distance for portal builds
 * portal requirements for links and fields (distance, minimum number of agents, portal level, resonators, and optimal link amp and very rare link amp mods)

### Commands

 * link help
 * link [intel link] [intel link]
 * link [intel link] [intel link] [intel link]
 * link [intel draw link or field]
 * link 87665544
 * link 88877766 2 la
 * link 88888888 2 la 1 vrla


### Examples

    bot link 88888888 2 la 1 vrla

> P8 (88888888) with 2 link amps and 1 vrla can link 5,079.040 km

    bot link https://www.ingress.com/intel?ll=50.745399,25.319992&z=10&pls=50.745399,25.319992,49.810349,73.097933_49.810349,73.097933,29.965612,31.004011_29.965612,31.004011,50.745399,25.319992

> Portal A: [https://www.ingress.com/intel?ll=50.745399,25.319992&z=17&pll=50.745399,25.319992](https://www.ingress.com/intel?ll=50.745399,25.319992&z=17&pll=50.745399,25.319992)   
Portal B: [https://www.ingress.com/intel?ll=49.810349,73.097933&z=17&pll=49.810349,73.097933](https://www.ingress.com/intel?ll=49.810349,73.097933&z=17&pll=49.810349,73.097933)   
Portal C: [https://www.ingress.com/intel?ll=29.965612,31.004011&z=17&pll=29.965612,31.004011](https://www.ingress.com/intel?ll=29.965612,31.004011&z=17&pll=29.965612,31.004011)   
Draw: [https://www.ingress.com/intel?ll=50.745399,25.319992&z=10&pls=50.745399,25.319992,49.810349,73.097933_49.810349,73.097933,29.965612,31.004011_29.965612,31.004011,50.745399,25.319992](https://www.ingress.com/intel?ll=50.745399,25.319992&z=10&pls=50.745399,25.319992,49.810349,73.097933_49.810349,73.097933,29.965612,31.004011_29.965612,31.004011,50.745399,25.319992)   

> Portal A to Portal B:   
Distance: 3,334.910 km   
Agents Required: 4   
Build: P7 (88887777) with 1 vrla   

> Portal A to Portal C:   
Distance: 2,357.053 km   
Agents Required: 2   
Build: P6 (88776666) with 1 link amp and 1 vrla   

> Portal B to Portal C:   
Distance: 4,135.163 km   
Agents Required: 5   
Build: P7 (88888777) with 2 link amps and 1 vrla   

## mu.js

A hubot-slack script to calculates MU needed to win a cycle

### Commands

 * mu [ENL score] [RES score] [current checkpoint # (optional)]

### Examples

    bot mu 10k 20k

> Current ENL score: 10,000   
Current RES score: 20,000   
Current checkpoint: #34   
ENL needs 360,000 total MU to tie next checkpoint, assuming RES score doesn't change.

    bot mu 45000 27000 28

>Current ENL score: 45,000   
Current RES score: 27,000   
Current checkpoint: #28   
RES needs 549,000 total MU to tie next checkpoint, assuming ENL score doesn't change.

## passcode.js

A hubot-slack script to generate bogus passcodes

### Commands

 * passcode
 * passcode [count]

### Examples

    bot passcode

> 7xzh8petlings355s

    bot passcode 10

> 9vxa6badgelessu759x   
5tuf2paralogicalq278p   
7use8pauserz978v   
9uwe5viatics499y   
8xvh5angularnessz362y   
4urh5pigeoneru596y   
8sqh7oversentimentalizes327p   
8upf6pellu389p   
2wwf3Koeriv877p   
2spa4biogeneticalq947r

