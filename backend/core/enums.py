from enum import Enum

class AppEnv(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"
    TESTING = "testing"

class CardStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class LayoutType(str, Enum):
    SINGLE_TOP = "single-top"
    SINGLE_BOTTOM = "single-bottom"
    GRID_2X2 = "grid-2x2"
    SPLIT_HORIZONTAL = "split-horizontal"

class WatermarkType(str, Enum):
    DWT_DCT = "dwt_dct"
    VISIBLE_OVERLAY = "visible_overlay"
