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
