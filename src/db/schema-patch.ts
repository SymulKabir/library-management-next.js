import { db } from "@/src/lib/db"; 

type ColumnDefinition = {
  name: string;
  type: string;
};

const updateTablesDynamically = async (tableName: string, newColumns: ColumnDefinition[]) => {
  const conn = await db();
  
  try {
    for (const col of newColumns) {
      // Check if the column exists
      const [rows]: any = await conn.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = ? AND COLUMN_NAME = ?
      `, [tableName, col.name]);

      if (rows.length === 0) {
        // Execute dynamic ALTER
        await conn.execute(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Column '${col.name}' added to '${tableName}' successfully.`);
      } else {
        console.log(`Column '${col.name}' already exists in '${tableName}'.`);
      }
    }
  } catch (error:any) {
    console.error("Error updating table:", error);
  } finally {
    await conn.end();
  }
};


const migrateDatabase = async () => {
  const updates = [
    { name: "face_id", type: "VARCHAR(255) NULL" }, 
  ];

  await updateTablesDynamically("students", updates);
};

migrateDatabase()