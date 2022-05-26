"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Commander_1 = __importDefault(require("Commander"));
var path_1 = __importDefault(require("path"));
var jimp_1 = __importDefault(require("jimp"));
var Application = /** @class */ (function () {
    function Application() {
    }
    Application.Main = function (argv) {
        return __awaiter(this, void 0, void 0, function () {
            var command, options, importPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = new Commander_1.default.Command();
                        command.version('1.0.0')
                            .option('-i, --input <string>', '资源路径')
                            .parse(argv);
                        options = command.opts();
                        importPath = options.input;
                        if (!fs_1.default.existsSync(importPath) || !fs_1.default.statSync(importPath).isDirectory()) {
                            console.error("输入文件夹不存在", importPath);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Application.DealDirectory(importPath)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.DealDirectory = function (directoryPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dirents, direntsIndex, dirent, direntPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dirents = fs_1.default.readdirSync(directoryPath, { withFileTypes: true });
                        direntsIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(direntsIndex < dirents.length)) return [3 /*break*/, 5];
                        dirent = dirents[direntsIndex];
                        direntPath = directoryPath + "\\" + dirent.name;
                        if (!dirent.isDirectory()) return [3 /*break*/, 2];
                        Application.DealDirectory(direntPath);
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Application.DealFile(direntPath)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        direntsIndex++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Application.DealFile = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var directoryPath, extension, data, lines, lineIndex, atlasName, atlasSize, atlasPath, atlasDirectoryPath, imageName, imagePath, imageDirectoryPath, isRotate, xy, size, orig, offset, index, image, origImage, offsetYMax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        directoryPath = path_1.default.dirname(filePath);
                        console.log("开始处理", path_1.default.basename(filePath));
                        extension = path_1.default.extname(filePath);
                        if (!(extension == ".atlas")) return [3 /*break*/, 5];
                        data = fs_1.default.readFileSync(filePath, "utf-8");
                        lines = data.split(/\r?\n/);
                        lineIndex = 0;
                        _a.label = 1;
                    case 1:
                        if (!(lineIndex < lines.length)) return [3 /*break*/, 5];
                        if (lines[lineIndex] == "") {
                            lineIndex += 1;
                            return [3 /*break*/, 1];
                        }
                        atlasName = lines[lineIndex];
                        atlasSize = JSON.parse("[" + lines[lineIndex + 1].split(": ")[1] + "]");
                        atlasPath = directoryPath + "\\" + atlasName.replace("/", "\\");
                        atlasDirectoryPath = path_1.default.dirname(atlasPath);
                        console.log("图集名称", atlasName);
                        lineIndex += 5;
                        _a.label = 2;
                    case 2:
                        if (!(lines[lineIndex] != "")) return [3 /*break*/, 4];
                        imageName = lines[lineIndex].replace("/", "\\") + ".png";
                        imagePath = directoryPath + "\\" + imageName;
                        imageDirectoryPath = path_1.default.dirname(imagePath);
                        isRotate = JSON.parse(lines[lineIndex + 1].split(": ")[1]);
                        xy = JSON.parse("[" + lines[lineIndex + 2].split(": ")[1] + "]");
                        size = JSON.parse("[" + lines[lineIndex + 3].split(": ")[1] + "]");
                        orig = JSON.parse("[" + lines[lineIndex + 4].split(": ")[1] + "]");
                        offset = JSON.parse("[" + lines[lineIndex + 5].split(": ")[1] + "]");
                        index = JSON.parse(lines[lineIndex + 6].split(": ")[1]);
                        return [4 /*yield*/, jimp_1.default.read(atlasPath)];
                    case 3:
                        image = _a.sent();
                        if (image.getWidth() < atlasSize[0] || image.getHeight() < atlasSize[1]) {
                            console.log("图集大小不正确", atlasName);
                            return [2 /*return*/];
                        }
                        if (isRotate) {
                            image.crop(xy[0], xy[1], size[1], size[0]);
                            image.rotate(-90);
                        }
                        else {
                            image.crop(xy[0], xy[1], size[0], size[1]);
                        }
                        origImage = new jimp_1.default(orig[0], orig[1]);
                        offsetYMax = orig[1] - image.getHeight();
                        origImage.blit(image, offset[0], offsetYMax - offset[1]);
                        origImage.write(imagePath);
                        console.log("输出图片", imageName);
                        lineIndex += 7;
                        return [3 /*break*/, 2];
                    case 4: return [3 /*break*/, 1];
                    case 5:
                        console.log("结束处理", path_1.default.basename(filePath));
                        return [2 /*return*/];
                }
            });
        });
    };
    Application.CheckDir = function (dirPath) {
        if (!fs_1.default.existsSync(dirPath) || !fs_1.default.statSync(dirPath).isDirectory()) {
            var parentDir = path_1.default.dirname(dirPath);
            Application.CheckDir(parentDir);
            fs_1.default.mkdirSync(dirPath);
        }
    };
    return Application;
}());
exports.default = Application;
Application.Main(process.argv);
