import React, { useEffect, useRef, useState } from 'react';
import { calculateAspectRatioFit } from './calculate-card-aspect-ratio-fit';
import './fonts.module.scss';

export interface CardRendererProps {
  maxHeight: number;
  maxWidth: number;
  cardData: any;
  onChange: (image: Blob) => void;
}

const cardWidth = 747;
const cardHeight = 1038;

const CardRenderer: React.FC<CardRendererProps> = ({ maxHeight, maxWidth, cardData, onChange }) => {
  const { width, height } = calculateAspectRatioFit({ width: cardWidth, height: cardHeight, maxHeight, maxWidth });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageCache, setImageCache] = useState<Array<{ el: HTMLImageElement; name: string }>>([]);

  useEffect(() => {
    renderCard(canvasRef.current!, cardData);
  });

  useEffect(() => {
    canvasRef.current!.toBlob((blob) => {
      if (!blob) return;
      onChange(blob);
    });
  });

  return (
    <React.Fragment>
      <canvas ref={canvasRef} width={width} height={height} />
    </React.Fragment>
  );

  function renderCard(canvas: HTMLCanvasElement, cardData: any) {
    const context = canvas.getContext('2d')!;
    context.fillStyle = '#cdcdcd';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    renderImage(0, 0, 'img.png');

    renderText({
      color: 'black',
      text: 'sample text',
      fontName: 'FuturaStd',
      fontSize: 48,
      x: 10,
      y: 250,
      maxWidth: 300,
      stroke: {
        color: 'white',
        width: 1,
      },
    });

    function renderText(args: RenderTextArgs): number {
      // TODO: narrow type of fontName to a specific set of names.

      context.font = `${args.fontSize}px ${args.fontName}`;
      if (args.stroke) {
        context.strokeStyle = args.stroke.color;
        context.lineWidth = args.stroke.width;
      } else {
        context.lineWidth = 0;
      }
      context.fillStyle = args.color;

      const textMetrics = context.measureText('fizz buzz');
      const lineHeight = textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent;

      if (args.wrap) {
        return renderMultilineText();
      } else {
        context.fillText(args.text, args.x, args.y, args.maxWidth);
        context.strokeText(args.text, args.x, args.y, args.maxWidth);
        return lineHeight;
      }

      function renderMultilineText(): number {
        const words = args.text.split(' ');
        let candidateLineWords: string[] = [];
        const lines: string[] = [];
        for (let i = 0; i < words.length; i++) {
          const testLine = `${candidateLineWords.length > 0 ? candidateLineWords.join(' ') + ' ' : ''}${words[i]}`;
          const candidateLineWidth = context.measureText(testLine).width;
          if (candidateLineWidth > args.maxWidth && i > 0) {
            candidateLineWords.pop();
            lines.push(candidateLineWords.join(' '));
            candidateLineWords = [words[i]];
          } else {
            candidateLineWords.push(words[i]);
          }
        }

        const blockHeight = lineHeight * lines.length;

        lines.forEach((l, i) => {
          context.fillText(l, args.x, args.y - (blockHeight - lineHeight * i));
          context.strokeText(l, args.x, args.y - (blockHeight - lineHeight * i));
        });

        return blockHeight;
      }
    }

    function renderImage(x: number, y: number, imgSrc: string, opts: { maxWidth?: number; maxHeight?: number } = {}) {
      const imgEl =
        imageCache.find((i) => i.name === imgSrc)?.el ??
        (() => {
          const value = document.createElement('img');
          value.src = imgSrc;
          setImageCache([...imageCache, { el: value, name: imgSrc }]);
          return value;
        })();

      const originalHeight = imgEl.height;
      const originalWidth = imgEl.width;

      const maxHeight = opts.maxHeight ?? originalHeight;
      const maxWidth = opts.maxWidth ?? originalWidth;
      const { height, width } = calculateAspectRatioFit({
        height: originalHeight,
        width: originalWidth,
        maxHeight,
        maxWidth,
      });

      imgEl.width = width;
      imgEl.height = height;

      context.drawImage(imgEl, x, y);
    }
  }
};

interface RenderTextArgs {
  x: number;
  y: number;
  text: string;
  fontName: string;
  fontSize: number;
  color: string;
  maxWidth: number;
  stroke?: {
    color: string;
    width: number;
  };
  wrap?: {
    baselineY: number;
  };
}

export default CardRenderer;
