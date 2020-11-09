
import matplotlib.font_manager as fm

types_colors = {
    "AT": "dimgrey",
    "RT": "darkorange",
    "OT": "steelblue",
}

fm._rebuild()
fonts = {
    "Default": fm.FontProperties(family=["sans-serif"]),
    "Korean": fm.FontProperties(
        family=["Noto Sans CJK KR", "Noto Sans CJK", "sans-serif"]
    ),
    "Tamil": fm.FontProperties(family=["Noto Sans Tamil", "sans-serif"]),
}
