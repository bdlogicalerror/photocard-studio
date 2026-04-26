import { PhotocardResponse } from '@/types/photocard'

export class Photocard {
  id: string
  imageUrl: string
  status: string
  filename: string

  constructor(data: PhotocardResponse) {
    this.id = data.id
    this.imageUrl = data.image_url
    this.status = data.status
    this.filename = data.filename
  }

  get isCompleted() {
    return this.status === 'completed'
  }
}
