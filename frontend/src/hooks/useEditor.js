import { useEffect, useRef, useCallback } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import CodeTool from '@editorjs/code';

/**
 * Hook para gerenciamento do EditorJS
 */
export const useEditor = (options = {}) => {
  const {
    holderId = 'editorjs',
    initialData = null,
    placeholder = 'Comece a escrever sua notícia aqui...',
    onReady = null,
  } = options;

  const editorRef = useRef(null);
  const isReadyRef = useRef(false);

  const initializeEditor = useCallback(() => {
    if (editorRef.current || !holderId) return;

    const editor = new EditorJS({
      holder: holderId,
      data: initialData,
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append('image', file);
                try {
                  const response = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: formData,
                  });
                  const result = await response.json();
                  return {
                    success: 1,
                    file: {
                      url: result.url,
                    },
                  };
                } catch (error) {
                  console.error('Image upload failed:', error);
                  return { success: 0 };
                }
              },
            },
          },
        },
        embed: Embed,
        quote: Quote,
        table: Table,
        code: CodeTool,
      },
      placeholder,
      onReady: () => {
        isReadyRef.current = true;
        if (onReady) onReady();
      },
    });

    editorRef.current = editor;
  }, [holderId, initialData, placeholder, onReady]);

  const save = useCallback(async () => {
    if (!editorRef.current || !isReadyRef.current) {
      throw new Error('Editor não está pronto');
    }
    return await editorRef.current.save();
  }, []);

  const render = useCallback(async (data) => {
    if (!editorRef.current) {
      throw new Error('Editor não está inicializado');
    }

    if (!isReadyRef.current) {
      await editorRef.current.isReady;
      isReadyRef.current = true;
    }

    if (!editorRef.current) {
      throw new Error('Editor foi destruído durante a inicialização');
    }

    return await editorRef.current.render(data);
  }, []);

  const clear = useCallback(() => {
    if (editorRef.current && isReadyRef.current) {
      editorRef.current.clear();
    }
  }, []);

  useEffect(() => {
    initializeEditor();

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, [initializeEditor]);

  return {
    editor: editorRef.current,
    save,
    render,
    clear,
    isReady: isReadyRef.current,
  };
};

