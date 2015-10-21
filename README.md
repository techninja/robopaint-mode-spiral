# Spiral Paint
An experimental spiral painting mode for RoboPaint

![spiral](https://cloud.githubusercontent.com/assets/320747/10012017/f6891412-60b7-11e5-9d17-a5192d729674.png)

This module is a mode for [RoboPaint](https://github.com/evil-mad/robopaint),
the software for drawing robots, and your
[friendly painting robot kit, the WaterColorBot](http://watercolorbot.com)!

This mode gives you the ability to pick any image and have it "painted" at a
height, varying between 40% and 100% down, between the "up" position and the
draw position, depending on the gray value at a given spiral position around the
image. The image above was created using the Tombow dualbrush pen, but regular
paint and variable width brushes work well too, as long as you don't have too
much water and you can get your calibration _just_ right.

![spiral2](https://cloud.githubusercontent.com/assets/320747/10012139/7853c18a-60b9-11e5-8ee3-155e0343d347.png)

Different images can be combined in one, like this faux CMYK color separation
image. For this example, color separation is done in Photoshop by copying the
Cyan, Magenta, Yellow and Black channels outinto individual gray images which
are painted each with the apprioriate color.

It's exceedingly important that your paper stay *_flat_* for these prints, and
as more ink/paint is added, the paper invariable warps. I highly recommend
adding a small amount tape or slightly tacky removable glue to the bottom of
your paper to ensure it stays as perfectly flat during the print as possible.

-----

All code MIT licensed. Created by [TechNinja](https://github.com/techninja),
with support and collaboration from
[Evil Mad Scientist](http://evilmadscientist.com).
