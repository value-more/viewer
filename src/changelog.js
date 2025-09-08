const { exec } = require('child_process');
const { promisify } = require('util');
const { writeFileSync } = require('fs');

const execp = promisify(exec);

const write = async () => {
    const { stdout } = await execp(
        'git log --oneline --since="Jan 01 2024" --no-merges --format="%ct%d %s"'
    );
    let arr = stdout.split('\n');
    let prevMessage = '';

    const versions = [];
    let activeVersion = { version: '', list: [] };
    arr.forEach((line) => {
        const sep = line.indexOf(' ');
        const date = Number(line.substring(0, sep));
        let message = line.substring(sep + 1);

        let tag = 'last';
        if (message.startsWith('(')) {
            const potentialTag = message
                .substring(1, message.indexOf(')'))
                .split(', ')
                .find((v) => v.startsWith('tag:'));
            if (potentialTag) {
                tag = potentialTag.substring(5);
            }
            message = message.substring(message.indexOf(')') + 2);
            activeVersion = { version: tag, list: [] };
            versions.push(activeVersion);
        }

        let type;
        if (message.startsWith('fix ') || message.startsWith('fix: ')) {
            type = 'fix';
        } else if (
            message.startsWith('improv ') ||
            message.startsWith('improv: ') ||
            message.startsWith('adjust ') ||
            message.startsWith('improve ')
        ) {
            type = 'improv';
        } else if (message.startsWith('refactor: ')) {
            type = 'refactor';
        } else {
            type = 'feat';
        }

        message = message.replace(
            /^(fix|feat|improv|refactor)((\([a-z0-9 ]+\))?:)? /i,
            ''
        );
        message = message.replace(/ \(#[0-9]+\)$/, '');
        message = message.trim();

        if (message === prevMessage || type === 'refactor') {
            return;
        }
        prevMessage = message;

        activeVersion.list.push({
            date,
            message,
            type
        });
    });

    writeFileSync('public/changelog.json', JSON.stringify(versions));
};

write();
