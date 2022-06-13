import fs from "fs";
import Commander from "Commander";
import path from "path";
import jimp from "jimp";
import Jimp from "jimp";

export default class Application {

    public static async Main(argv: string[]) {
        let command = new Commander.Command()
        command.version('1.0.0')
            .option('-i, --input <string>', '资源路径')
            .option('-d, --directory', '生成独立文件夹')
            .parse(argv);

        let options = command.opts();

        let isDirectory = options.directory;
        let importPath = options.input;

        if (!fs.existsSync(importPath) || !fs.statSync(importPath).isDirectory()) {
            console.error("输入文件夹不存在", importPath);
            return;
        }

        await Application.DealDirectory(isDirectory, importPath);
    }

    private static async DealDirectory(isDirectory: boolean, directoryPath: string) {

        let dirents = fs.readdirSync(directoryPath, { withFileTypes: true });

        for (let direntsIndex = 0; direntsIndex < dirents.length; direntsIndex++) {
            const dirent = dirents[direntsIndex];

            let direntPath = directoryPath + "\\" + dirent.name;

            if (dirent.isDirectory()) {
                Application.DealDirectory(isDirectory, direntPath)
            } else {
                await Application.DealFile(isDirectory, direntPath);
            }
        }
    }

    private static async DealFile(isDirectory: boolean, filePath: string) {
        let directoryPath = path.dirname(filePath);
        console.log("开始处理", path.basename(filePath));
        let extension = path.extname(filePath);
        if (extension == ".atlas") {

            const data = fs.readFileSync(filePath, "utf-8");

            const lines = data.split(/\r?\n/);

            let lineIndex = 0;

            while (lineIndex < lines.length) {

                if (lines[lineIndex] == "") {
                    lineIndex += 1;
                    continue;
                }

                let atlasName = lines[lineIndex];

                let atlasSize = JSON.parse("[" + lines[lineIndex + 1].split(": ")[1] + "]");

                let atlasPath = directoryPath + "\\" + atlasName.replace("/", "\\");

                let atlasDirectoryPath = path.dirname(atlasPath);

                console.log("图集名称", atlasName);

                lineIndex += 5;

                while (lines[lineIndex] != "") {

                    let imageName = lines[lineIndex].replace("/", "\\") + ".png";

                    let imagePath = "";

                    if (isDirectory) {
                        imagePath = directoryPath + "\\" + path.basename(filePath, ".atlas") + "\\" + imageName;
                    } else {
                        imagePath = directoryPath + "\\" + imageName;
                    }

                    let imageDirectoryPath = path.dirname(imagePath);

                    let isRotate = JSON.parse(lines[lineIndex + 1].split(": ")[1]);
                    let xy = JSON.parse("[" + lines[lineIndex + 2].split(": ")[1] + "]");
                    let size = JSON.parse("[" + lines[lineIndex + 3].split(": ")[1] + "]");
                    let orig = JSON.parse("[" + lines[lineIndex + 4].split(": ")[1] + "]");
                    let offset = JSON.parse("[" + lines[lineIndex + 5].split(": ")[1] + "]");
                    let index = JSON.parse(lines[lineIndex + 6].split(": ")[1]);

                    let image = await jimp.read(atlasPath);

                    if (image.getWidth() < atlasSize[0] || image.getHeight() < atlasSize[1]) {
                        console.log("图集大小不正确", atlasName);
                        return;
                    }

                    if (isRotate) {
                        image.crop(xy[0], xy[1], size[1], size[0]);
                        image.rotate(-90);
                    } else {
                        image.crop(xy[0], xy[1], size[0], size[1]);
                    }

                    let origImage = new jimp(orig[0], orig[1]);

                    let offsetYMax = orig[1] - image.getHeight();

                    origImage.blit(image, offset[0], offsetYMax - offset[1]);

                    origImage.write(imagePath);

                    console.log("输出图片", imageName);

                    lineIndex += 7;
                }

            }
        }
        console.log("结束处理", path.basename(filePath));
    }

    private static CheckDir(dirPath: string) {
        if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
            let parentDir = path.dirname(dirPath);
            Application.CheckDir(parentDir);
            fs.mkdirSync(dirPath);
        }
    }

}

Application.Main(process.argv);