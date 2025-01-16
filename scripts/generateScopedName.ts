import path from 'path'

/**
 *
 * @param name 类名
 * @param filePath 文件的绝对路径
 * @param css css的属性对象
 *
 */
export const generateScopedName = (name: string, filePath: string, css: string) => {
    // 获取文件名
    const filename = path.basename(filePath).split('.')[0]
    // 获取文件夹名
    const foldername = filename === 'index' ? path.basename(path.dirname(filePath)) : filename
    // 使用 Vite 自带的 hash 工具函数生成 base64 的 hash
    const hash = Buffer.from(css).toString('base64').substring(0, 5)
    // 组合文件夹名、文件名和类名
    const scopedName = `${foldername}__${name}__${hash}`
    // 返回自定义格式的类名
    return scopedName
}
