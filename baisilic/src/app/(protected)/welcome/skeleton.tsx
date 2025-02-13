import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export const ProjectSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="rounded-lg shadow-none">
            <CardHeader className="bg-muted p-3">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <div className="space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

export const LearningSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="rounded-lg shadow-none">
            <CardHeader className="bg-muted p-3">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-0">
                <Skeleton className="h-40 w-full rounded-b-lg" />
            </CardContent>
        </Card>
    </motion.div>
);