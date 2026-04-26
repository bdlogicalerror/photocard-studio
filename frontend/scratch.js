const fs = require('fs');
let code = fs.readFileSync('src/components/CardPreview.tsx', 'utf8');

// 1. Update Props type
code = code.replace(/forExport\?:\s*boolean\n}/g, 'forExport?: boolean\n  isInteractive?: boolean\n  onPhotoPositionChange?: (idx: number, pos: string) => void\n}');

// 2. Update CardPreview destruction
code = code.replace(/forExport = false }: Props\) {/g, 'forExport = false, isInteractive, onPhotoPositionChange }: Props) {');

// 3. Update PhotoSlot props
const photoSlotOld = `function PhotoSlot({ src, objectFit = 'cover', objectPosition = 'center', scale = 1, placeholder }: {
  src?: string | null
  objectFit?: string
  objectPosition?: string
  scale?: number
  placeholder: string
}) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#2a2a2a' }}>
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: objectFit as any,
            objectPosition,
            transform: \`scale(\${scale})\`,
            transformOrigin: 'center',
            display: 'block',
          }}
        />`;

const photoSlotNew = `function PhotoSlot({ src, objectFit = 'cover', objectPosition = 'center', scale = 1, placeholder, idx, isInteractive, onPositionChange }: {
  src?: string | null
  objectFit?: string
  objectPosition?: string
  scale?: number
  placeholder: string
  idx?: number
  isInteractive?: boolean
  onPositionChange?: (idx: number, pos: string) => void
}) {
  const isDragging = React.useRef(false)
  const startMouse = React.useRef({ x: 0, y: 0 })

  const getInitialPos = () => {
    if (!objectPosition || objectPosition === 'center') return { x: 50, y: 50 }
    const match = objectPosition.match(/(-?[\\d.]+)%\\s+(-?[\\d.]+)%/)
    if (match) return { x: parseFloat(match[1]), y: parseFloat(match[2]) }
    return { x: 50, y: 50 }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isInteractive || !src || objectFit !== 'cover') return
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    startMouse.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return
    const dx = e.clientX - startMouse.current.x
    const dy = e.clientY - startMouse.current.y
    startMouse.current = { x: e.clientX, y: e.clientY }

    const cur = getInitialPos()
    const factor = 0.5 / scale 
    const newX = Math.max(0, Math.min(100, cur.x - dx * factor))
    const newY = Math.max(0, Math.min(100, cur.y - dy * factor))

    if (onPositionChange && idx !== undefined) {
      onPositionChange(idx, \`\${newX.toFixed(1)}% \${newY.toFixed(1)}%\`)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging.current) return
    isDragging.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', background: '#2a2a2a' }}>
      {src ? (
        <img
          src={src}
          alt=""
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: '100%', height: '100%',
            objectFit: objectFit as any,
            objectPosition,
            transform: \`scale(\${scale})\`,
            transformOrigin: 'center',
            display: 'block',
            cursor: isInteractive && objectFit === 'cover' ? 'move' : 'default',
            touchAction: 'none'
          }}
        />`;

code = code.replace(photoSlotOld, photoSlotNew);

// 4. Update the p[X] usages
code = code.replace(/<PhotoSlot \{\.\.\.\(p\[(\d+)\] \|\| \{\}\)\} /g, '<PhotoSlot {...(p[$1] || {})} idx={$1} isInteractive={isInteractive} onPositionChange={onPhotoPositionChange} ');

fs.writeFileSync('src/components/CardPreview.tsx', code);
console.log('Successfully patched CardPreview.tsx!');
