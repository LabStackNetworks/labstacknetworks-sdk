class LabStackApiError(Exception):
    def __init__(self, message: str, status: int, url: str):
        super().__init__(message)
        self.status = status
        self.url = url
