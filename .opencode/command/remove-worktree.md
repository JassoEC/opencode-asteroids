---
description: Elimina un git worktree de .worktrees/<nombre> (reemplaza espacios por guiones)
---

Eliminar un git worktree existente.

El usuario ha invocado `/remove-worktree` con el argumento: $ARGUMENTS

Pasos a seguir:
1. Extraer el nombre del worktree de `$ARGUMENTS`
2. Reemplazar cualquier espacio en el nombre por guiones (`-`) para obtener el nombre sanitizado
3. Verificar si existe la carpeta `.worktrees/<nombre-sanitizado>` usando `ls .worktrees/<nombre-sanitizado>`
4. Si no existe, verificar también si existe un worktree con ese nombre usando `git worktree list --porcelain`
5. Si el worktree no existe en ningún lugar, informar al usuario y DETENERSE
6. Si el worktree existe:
   a. Ejecutar: `git worktree remove .worktrees/<nombre-sanitizado>`
   b. Verificar si existe una rama local con el mismo nombre: `git branch --list <nombre-sanitizado>`
   c. Si la rama existe, ejecutar: `git branch -D <nombre-sanitizado>`
7. Informar al usuario el resultado de la operación
