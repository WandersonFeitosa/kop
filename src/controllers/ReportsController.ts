import { Request, Response } from 'express';
export class ReportsController {
  async getRelatory(req: Request, res: Response) {
    const { id } = req.params;
    const urlList = [
      'https://www.youtube.com/embed/eEzD-Y97ges?si=g67LeBQT727CDheC',
      'https://www.youtube.com/embed/u31qwQUeGuM?si=_BhdOCg877lDg640',
      'https://www.youtube.com/embed/ScMzIvxBSi4?si=RE0mDqk-pCw2S--N',
      'https://www.youtube.com/embed/NpEaa2P7qZI?si=PqQIg153BLj2qua-',
    ];
    const embedUrl =
      'https://us-east-1.quicksight.aws.amazon.com/embed/faac62a7363c4aa4a2ebbc695d8ba579/dashboards/6d7ef4a7-70cc-440b-abf8-75d1e6f1c495?code=AYABeAMZEINPKfS3ZQjvf8G5m_UAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTE6MjU5NDgwNDYyMTMyOmtleS81NGYwMjdiYy03MDJhLTQxY2YtYmViNS0xNDViOTExNzFkYzMAuAECAQB4xtoTZf7IGoPQKGWjcNLglYg8fHKEoB_X6wbByfSPUT0Bt_q8j-kQdkLrM4mpuysqtAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDIQgMbIwULkQv0OrAgIBEIA75BV4Nf6LMB3B_1VLG6cjeZrB6l5iNj_0C4HDrOQtT5KwVaNQOVRL_byszEo0QPL2aZl5pCg-bntf19ICAAAAAAwAABAAAAAAAAAAAAAAAAAAx8oTRPhf71OPrOtFI5hUN_____8AAAABAAAAAAAAAAAAAAABAAAAm-KWMRUwWE5i7ULcqGRUSsSpqKFRMBcW5D02efhZ6M1SXcdx3FZE3-ReLAJKeohYDEjujfoFaLIDcPqGkzHbglOIhrQ-zHjWHmH0foFFlX4nYH19cyoxUzAiDxdZnHC4me8A4D5SRk-4zSESEmiQUw1tfrXFyAFMZLvh3Xnx9A2V7GvhAdXxJttRFKyLvyiGFeJMADGZlUjHtIigTsSXahrfXISvUX5j-uerzA%3D%3D&identityprovider=quicksight&isauthcode=true';
    let returnUrl = '';
    if (id === '1') {
      returnUrl = embedUrl;
    } else {
      returnUrl = urlList[Math.floor(Math.random() * urlList.length)];
    }
    const responseObject = {
      httpCode: 200,
      httpMessage: 'OK',
      status: true,
      data: {
        id,
        embedUrl: returnUrl,
      },
      transaction: {
        localTransactionId: '02ce0297-f7e4-42b0-9ed1-94518b539918',
        localTransactionDate: '2023-11-22T21:47:28.113Z',
      },
    };

    return res.status(200).json(responseObject);
  }
}
