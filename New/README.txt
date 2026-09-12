NATIONAL CITY 3D WEB — V8.5 INTERIOR CONTROLS FIX

This build fixes movement controls inside buildings.

ROOT CAUSE FOUND
The interior rooms are intentionally placed far away from the outdoor city:
Hospital x≈460, School x≈400, City Hall x≈340, Police x≈520.

The outdoor city-boundary function treated any x position beyond about ±202 as outside the map.
Because that outdoor collision check was still running indoors, every movement step inside a building was immediately cancelled.

FIX
- Outdoor sea/city-boundary collision is now disabled while inside a building.
- Outdoor building collision is also disabled while inside.
- Interior rooms now use their own wall-boundary collision instead.
- The player can move normally inside hospital, school, City Hall, police station and houses.
- The player still cannot walk through the room's outer walls.
- Controls are safely reset after an entry/exit transition so no stale button state remains.
- Interior HUD now explicitly says "Controls Ready · Inside".
- Interior hints show WASD / arrow movement instructions.

All mouse, keyboard, map, top view, textures, traffic, missions and dialogue features from V8.4 remain.
