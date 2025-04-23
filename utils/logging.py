import logging, platform

class HostnameFilter(logging.Filter):
    hostname = platform.node()

    def filter(self, record):
        record.hostname = HostnameFilter.hostname
        return True

handler = logging.StreamHandler()
handler.addFilter(HostnameFilter())
handler.setFormatter(logging.Formatter('%(asctime)s %(hostname)s: %(message)s', datefmt='%b %d %H:%M:%S'))

logger = logging.getLogger()
logger.addHandler(handler)
logger.setLevel(logging.INFO)