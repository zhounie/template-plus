
// 合并package.json
export function mergePkg (pkg, targetPkg) {
  Object.keys(pkg).forEach(key => {
    if (typeof targetPkg[key] === 'string') {
      targetPkg[key] = pkg[key]
    } else if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
      if (Object.prototype.toString.call(targetPkg[key]) === '[object Object]') {
        targetPkg[key] = Object.assign(targetPkg[key], pkg[key])
      }
    } else {
      targetPkg[key] = pkg[key]
    }
  })
}
