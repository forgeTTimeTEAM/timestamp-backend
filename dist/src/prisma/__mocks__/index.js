"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const child_process_1 = require("child_process");
const path_1 = require("path");
const url_1 = require("url");
const uuid_1 = require("uuid");
const generateDatabaseURL = (schema) => {
    if (!process.env.DATABASE_URL) {
        throw new Error("please provide a database url");
    }
    const url = new url_1.URL(process.env.DATABASE_URL);
    url.searchParams.append("schema", schema);
    return url.toString();
};
const schemaId = `test-${(0, uuid_1.v4)()}`;
const prismaBinary = (0, path_1.resolve)("./node_modules", "./.bin", "./prisma");
const url = generateDatabaseURL(schemaId);
process.env.DATABASE_URL = url;
exports.prisma = new client_1.PrismaClient({
    datasources: { db: { url } },
});
beforeAll(() => {
    (0, child_process_1.execSync)(`${prismaBinary} db push --skip-generate`, {
        env: Object.assign(Object.assign({}, process.env), { DATABASE_URL: generateDatabaseURL(schemaId) }),
    });
});
afterAll(async () => {
    await exports.prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`);
    await exports.prisma.$disconnect();
});
