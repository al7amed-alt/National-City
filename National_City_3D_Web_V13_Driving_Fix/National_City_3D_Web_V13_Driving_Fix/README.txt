NATIONAL CITY 3D WEB — V13 DRIVING FIX

CORRECTED CONTROLS
W / Up Arrow = FORWARD
S / Down Arrow = BRAKE, then REVERSE
A / Left Arrow = STEER LEFT
D / Right Arrow = STEER RIGHT
Shift = faster driving

ROOT CAUSE FIXED
The realistic physics code used +Z as vehicle-forward, while National City's visible car models face local -Z. This made forward/backward feel reversed. V13 uses the same -Z convention for both the visible car and the physics calculation, and corrects steering to match.

BETTER CAR VIEW
Driver view:
- eye position raised above the dashboard
- camera moved slightly forward toward the windshield
- 74-degree field of view
- looks approximately 34 m ahead down the road
- reduced near clipping

Exterior driving view:
- camera is farther behind the car
- camera is higher
- looks approximately 18 m ahead
- 70-degree field of view
This makes roads, turns, traffic and driveways easier to see.

RETAINED
V12 city logic, 20 driveways, real door openings, interiors, sleep/day system, garage placement, traffic, NPCs, missions and V11 real-world-inspired vehicle dynamics.

VALIDATION
JavaScript syntax passed.
Static checks passed for corrected forward axis, corrected steering sign, driver view and chase view.
A runtime driving-setup sanity check is also included.
