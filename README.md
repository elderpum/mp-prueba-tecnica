# Comandos para levantar el docker-compose
1. docker-compose up -d database backend frontend
2. docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -i /scripts/db.sql
3. docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -d MinisterioPublico -i /scripts/sp.sql
4. docker exec mp-database /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "MpPassword123!" -C -d MinisterioPublico -Q "SELECT name FROM sys.procedures ORDER BY name"