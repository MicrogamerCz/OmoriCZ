// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "omoributton.h"

#include <QFontMetrics>
#include <QPainter>

OmoriButton::OmoriButton(const QString &text, QWidget *parent) : QPushButton(text, parent) {
    QFont btnFont = font();
    btnFont.setPixelSize(36);
    setFont(btnFont);

    setFlat(true);
    setCursor(Qt::PointingHandCursor);
    setFocusPolicy(Qt::NoFocus);
    setContentsMargins(0, 0, 0, 0);
    setSizePolicy(QSizePolicy::Minimum, QSizePolicy::Minimum);
}

QSize OmoriButton::sizeHint() const {
    const QFontMetrics fm(font());
    return QSize(fm.horizontalAdvance(text()), fm.height());
}

void OmoriButton::paintEvent(QPaintEvent *event) {
    Q_UNUSED(event)

    QPainter painter(this);
    painter.setPen(palette().windowText().color());
    painter.setFont(font());
    painter.drawText(rect(), Qt::AlignCenter, text());
}
