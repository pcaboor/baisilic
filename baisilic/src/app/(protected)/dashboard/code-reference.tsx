'use client'

import React from 'react'
import { Tabs, TabsContent } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
    filesReferences: { fileName: string; sourceCode: string; summary: string }[]
}

const CodeReference = ({ filesReferences }: Props) => {
    const [tab, setTable] = React.useState(filesReferences[0]?.fileName)
    if (filesReferences.length === 0) return null
    return (
        <div className='max-w-[70vw]'>
            <Tabs value={tab} onValueChange={setTable}>
                <div className='overflow-scroll flex gap-2 bg-gray-200 p-1 rounded-md'>
                    {filesReferences.map((file => (
                        <button onClick={() => setTable(file.fileName)} key={file.fileName} className={cn(
                            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:bg-muted',
                            {
                                'bg-primary text-primary-foreground': tab === file.fileName,
                            }
                        )}>
                            {file.fileName}
                        </button>
                    )))
                    }
                </div>
                {filesReferences.map(file => (
                    <TabsContent key={file.fileName} value={file.fileName} className='max-h-[40vh] overflow-scroll max-w-7xl'>
                        <SyntaxHighlighter language='typescript' style={vscDarkPlus} showLineNumbers >
                            {file.sourceCode}
                        </SyntaxHighlighter>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default CodeReference