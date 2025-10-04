import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

interface SpeechToTextProps {
    onResult: (transcript: string) => void;
}

export const SpeechToText: React.FC<SpeechToTextProps> = ({ onResult }) => {
    const [text, setText] = useState<string>('');
    const [recognition, setRecognition] = useState<any>();
    const {
        i18n: { language }
    } = useTranslation();

    const listen = useCallback(async () => {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = language;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            setText(
                [...event.results]
                    .filter((r: any) => !!r[0].transcript.trim())
                    .map((r: any) => {
                        const t = r[0].transcript.trim();
                        return (
                            t[0].toUpperCase() +
                            (t.length > 1 ? t.substring(1) : t)
                        );
                    })
                    .join('. ') + '.'
            );
        };

        recognition.onerror = (event: any) => {
            console.log('error', event);
            setRecognition(null);
        };

        recognition.onnomatch = (event: any) => {
            console.log('nomatch', event);
            setRecognition(null);
        };

        recognition.start();
        setRecognition(recognition);
    }, []);

    return (
        <>
            <Button text onClick={listen} icon="pi pi-microphone" />
            {recognition && (
                <Dialog
                    header={
                        'Sentences are displayed as you speak then click outside of dialog to stop'
                    }
                    closeOnEscape={false}
                    dismissableMask={true}
                    closable={false}
                    onHide={() => {
                        if (recognition) {
                            recognition.stop();
                            setRecognition(null);
                            text && onResult(text);
                            setText('');
                        }
                    }}
                    modal
                    visible={!!recognition}
                >
                    {text}
                </Dialog>
            )}
        </>
    );
};
