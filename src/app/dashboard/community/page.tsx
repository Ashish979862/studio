"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function CommunityPage() {
    const whatsappNumber = "919102305415";
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    return (
        <Card className="bg-secondary text-center">
            <CardHeader>
                <CardTitle>Help Center</CardTitle>
                <CardDescription>Need help? Contact us directly on WhatsApp.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <MessageSquare className="h-16 w-16 text-primary" />
                <p>For any questions or support, please reach out to us.</p>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        Contact on WhatsApp
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}
