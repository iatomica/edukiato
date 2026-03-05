import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    private resolveInstitutionId(req: any): string {
        const institutionId = req.user?.institutionId || req.query?.institutionId;
        if (!institutionId) {
            throw new BadRequestException('institutionId is required');
        }
        return institutionId;
    }

    private resolveUserId(req: any): string {
        return req.user?.userId || req.user?.id || req.user?.sub;
    }

    @Get('conversations')
    async getConversations(@Req() req: any) {
        const institutionId = this.resolveInstitutionId(req);
        const currentUserId = this.resolveUserId(req);
        return this.messagesService.getConversations(institutionId, currentUserId);
    }

    @Get(':targetUserId')
    async getMessages(@Param('targetUserId') targetUserId: string, @Req() req: any) {
        const institutionId = this.resolveInstitutionId(req);
        const currentUserId = this.resolveUserId(req);
        return this.messagesService.getMessages(institutionId, currentUserId, targetUserId);
    }

    @Post(':targetUserId')
    async sendMessage(
        @Param('targetUserId') targetUserId: string,
        @Req() req: any,
        @Body() body: { content: string; file?: { name?: string; url?: string; type?: string; size?: number } },
    ) {
        const institutionId = this.resolveInstitutionId(req);
        const currentUserId = this.resolveUserId(req);
        if (!body?.content?.trim() && !body?.file) {
            throw new BadRequestException('content or file is required');
        }

        return this.messagesService.sendMessage(
            institutionId,
            currentUserId,
            targetUserId,
            body.content || '',
            body.file,
        );
    }

    @Put(':targetUserId/read')
    async markAsRead(@Param('targetUserId') targetUserId: string, @Req() req: any) {
        const institutionId = this.resolveInstitutionId(req);
        const currentUserId = this.resolveUserId(req);
        return this.messagesService.markAsRead(institutionId, currentUserId, targetUserId);
    }
}
