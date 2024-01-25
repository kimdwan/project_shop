import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  private test_list:any[] = []

  test_get(cookies:any) : string {
    const parse_cookie = JSON.stringify(cookies)
    return `안녕하세요 test서버입니다. ${parse_cookie}`
  }

  test_post(item:any) : string {
    const parse_item = JSON.stringify(item)
    const first_text = `당신이 대입한 값은 ${parse_item} 입니다. \n`
    this.test_list.push(parse_item)
    const last_text = this.test_list.map((text,idx) => `${idx+1}: ${text}`).join('\n')
    const total_text = `${first_text}${last_text}`
    return total_text
  }
}
