import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { CreateThreadDto, SendMessageDto } from './dto/chat.dto';

@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private chat: ChatService) {}

  @Post('threads')
  open(@CurrentUser() u: { sub: string }, @Body() dto: CreateThreadDto) {
    return this.chat.ensureThread(u.sub, dto.storeId);
  }

  @Get('threads/:id/messages')
  list(@CurrentUser() u: { sub: string }, @Param('id') id: string) {
    return this.chat.messages(id, u.sub);
  }

  @Post('threads/:id/messages')
  send(
    @CurrentUser() u: { sub: string },
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chat.send(id, u.sub, dto);
  }
}
