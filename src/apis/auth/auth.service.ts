import { BaseService } from '@/shared/base.service'
import { Injectable } from '@nestjs/common'
import { Axios } from 'axios'
import { compareSync } from 'bcryptjs'
import https from 'https'

@Injectable()
export class AuthService extends BaseService {
  private readonly _axios: Axios

  constructor() {
    super()
    this._axios = new Axios({ timeout: 10000, httpsAgent: new https.Agent({ family: 4 }) })
  }

  async signIn(username: string, password: string) {
    const user = await this._prisma.adminUsers.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        usersRoles: { select: { adminRole: { select: { code: true } } } }
      }
    })

    if (user) {
      const { usersRoles, password: hashed, ...output } = user
      if (compareSync(password, hashed)) {
        output['roles'] = usersRoles.map((r) => r.adminRole.code)
        return output
      }
    }

    return null
  }
}
