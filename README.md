
## Getting Started
make Sure you have installed NodeJS `v21.7.3`


### Run MySQL useing docker
```
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=12345 \
  -e MYSQL_DATABASE=library_management \
  -e MYSQL_USER=book_hive \
  -e MYSQL_PASSWORD=12345 \
  -p 3306:3306 \
  mysql:8
```
#### First, log in as the MySQL root user:
```bash
mysql -u root -p
```

#### Then run the following SQL commands to create the user and grant full privileges on your database:

```bash
CREATE DATABASE IF NOT EXISTS library_management;

CREATE USER IF NOT EXISTS 'book_hive'@'%' IDENTIFIED BY '12345';

GRANT ALL PRIVILEGES ON library_management.* TO 'book_hive'@'%';

FLUSH PRIVILEGES;
```
#### Verify your user 
```bash
mysql -u book_hive -p
```

### Installation and Run
```
npm install
```
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


### Initialize Database (if not initialize before)
```
npm run init-db
```

### Insert some books (if required some dome book)
```
npm run insert-book
```