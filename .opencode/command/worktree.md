---
description: Crea un nuevo git worktree en .worktrees/<nombre> (reemplaza espacios por guiones)
---

Crear un nuevo git worktree con el nombre proporcionado.

El usuario ha invocado `/worktree` con el argumento: $ARGUMENTS

Pasos a seguir:
1. Extraer el nombre del worktree de `$ARGUMENTS`
2. Reemplazar cualquier espacio en el nombre por guiones (`-`) para obtener el nombre sanitizado
3. Verificar si ya existe la carpeta `.worktrees/<nombre-sanitizado>` o si ya existe un worktree con ese nombre usando `git worktree list`
4. Si ya existe, informar al usuario y NO proceder
5. Si no existe `.worktrees/`, crear el directorio primero
6. Ejecutar: `git worktree add .worktrees/<nombre-sanitizado>`
7. Informar al usuario el resultado de la operación
