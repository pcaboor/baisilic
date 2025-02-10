import { ChartNoAxesGantt, Link, ListMinus } from 'lucide-react';
import React from 'react';
import { Card, CardHeader, CardContent } from '~/components/ui/card';

const QuestionCard: React.FC<{ question: string; onClick: (question: string) => void }> = ({ question, onClick }) => {
    return (
        <div>
            <Card
                className="rounded-lg shadow-none cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => onClick(question)}
            >
                <CardHeader className="bg-muted text-neutral-600 p-3 font-medium flex">
                    <ListMinus />
                    {/* <span>{project.name}</span> */}
                </CardHeader>
                <CardContent className="text-sm p-3">
                    {question}
                </CardContent>
            </Card>
        </div>
    );
};

export default QuestionCard;
