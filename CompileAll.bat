::goto Test

:Core
echo --- Compile Shaders
cd Source/Core/Shader/
call node MergeShaderSources.mjs
cd ..
echo --- Compile Core
call npx tsc -p tsconfig.json
echo --- Compile Core Minimal
call npx tsc -p tsconfig-minimal.json
echo --- Generate Documentation
call npx typedoc
cd ../..

:Aid
echo --- Compile Aid
cd Source/Aid/
call npx tsc -p tsconfig.json
echo --- Generate Documentation
call npx typedoc
cd ../..

:UserInterface
echo --- Compile UserInterface
cd Source/UserInterface/
call npx tsc -p tsconfig.json
echo --- Generate Documentation
call npx typedoc
cd ../..

:Net
echo --- Compile Net
cd Source/Net
call npx tsc -p tsconfig.json
echo module.exports = {FudgeNet: FudgeNet}; >> .\\Server\\Message.js
call AddExport .\\Server\\Message.d.ts
cd Server
call npx tsc -p tsconfig.json
cd ..
cd Client
call npx tsc -p tsconfig.json
cd ..
echo --- Generate Documentation
call npx typedoc --tsconfig tsconfig.typedoc.json
cd ../..

:Editor
echo --- Compile Editor
cd Editor/Source
call npx tsc -p tsconfig.json
cd Fudge
call npx tsc -p tsconfig.json
cd ../../..

:Test
echo --- Compile Test
cd Test
call npx tsc -p tsconfig.json
cd ..
pause