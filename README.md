# ingress-slack

A small collection of hubot-slack scripts for Ingress teams

 * link.js: calculates portal linkability
 * mu.js: calculates MU required to win a cycle
 * passcode.js: generates bogus passcodes

To use, just drop the scripts you like into your hubot's scripts directory. If any dependencies
are listed in the script, be sure to add them to your hubot's package.json.

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

    mu 10k 20k

> Current ENL score: 10,000   
Current RES score: 20,000   
Current checkpoint: #34   
ENL needs 360,000 total MU to tie next checkpoint, assuming RES score doesn't change.

    mu 45000 27000 28

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

    passcode

> 7xzh8petlings355s

    passcode 10

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

