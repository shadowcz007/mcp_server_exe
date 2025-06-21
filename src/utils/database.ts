import initSqlJs from 'sql.js'
import fs from 'fs'
import path from 'path'

async function createDatabase (dbPath: string) {
  const SQL = await initSqlJs()
  let db: any = null
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath)
    db = new SQL.Database(filebuffer)
  } else {
    // 否则创建新的数据库
    db = new SQL.Database()
  }

  db._saveDBFile = () => {
    const data = db.export() // 导出为二进制 Buffer
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    fs.writeFileSync(dbPath, Buffer.from(data))
  }
  return db
}

export default createDatabase
