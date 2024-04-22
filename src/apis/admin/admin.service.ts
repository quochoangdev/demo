import { BaseService } from '@/shared/base.service'
import { Injectable, Logger } from '@nestjs/common'
//
@Injectable()
export class AdminService extends BaseService {
  private readonly _logger: Logger = new Logger(AdminService.name)

  async getMenu() {
    return [
      {
        path: 'sites',
        icon: `<svg class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>`,
        text: 'Sites'
      },
      {
        path: 'users',
        icon: `<svg fill="currentColor" class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"></path><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"></path></svg>`,
        text: 'Users'
      },
      {
        path: 'tracking',
        icon: `<svg class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>`,
        text: 'Trackings'
      },
      {
        path: 'languages',
        icon: `<svg class="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" fill="currentColor" viewBox="796 796 200 200" xml:space="preserve"><path d="M973.166 818.5H818.833c-12.591 0-22.833 10.243-22.833 22.833v109.333c0 12.59 10.243 22.833 22.833 22.833h154.333c12.59 0 22.834-10.243 22.834-22.833V841.333c0-12.59-10.244-22.833-22.834-22.833M896 961.5h-77.167c-5.973 0-10.833-4.859-10.833-10.833V841.333c0-5.974 4.86-10.833 10.833-10.833H896zm82.58-89.371c-.547 9.145-5.668 27.261-20.869 39.845 4.615 1.022 9.629 1.573 14.92 1.573v12c-10.551 0-20.238-1.919-28.469-5.325-7.689 3.301-16.969 5.325-28.125 5.325v-12c5.132 0 9.924-.501 14.366-1.498-8.412-7.016-13.382-16.311-13.382-26.78h11.999c0 8.857 5.66 16.517 14.884 21.623 4.641-2.66 8.702-6.112 12.164-10.351 5.628-6.886 8.502-14.521 9.754-20.042h-49.785v-12h22.297v-11.986h12V864.5h21.055c1.986 0 3.902.831 5.258 2.28a7.2 7.2 0 0 1 1.933 5.349"/><path d="m839.035 914.262-4.45 11.258h-15.971l26.355-61.09h15.971l25.746 61.09h-16.583l-4.363-11.258zm13.44-34.386-8.902 22.604h17.629z"/></svg>`,
        text: 'Languages'
      }
    ]
  }
}
