// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "omoricard.h"
#include <QPainter>

OmoriCard::OmoriCard(QWidget *parent) : QWidget(parent) {
    int margin = 20;
    setContentsMargins(margin * 2, margin, margin * 2, margin);
}

void OmoriCard::resizeEvent(QResizeEvent *event) {
    Q_UNUSED(event)

    if (layout()) {
        layout();
        return;
    }

    for (QObject *child : children()) {
        if (QWidget *label = qobject_cast<QWidget *>(child))
            label->setGeometry(rect().marginsAdded(QMargins(20, 20, 20, 20)));
    }
}

void OmoriCard::paintEvent(QPaintEvent *) {
    QPainter p(this);
    p.fillRect(rect(), Qt::white);

    p.setPen(QPen(Qt::black, 2));
    p.drawRect(rect().adjusted(1, 1, -1, -1));

    p.fillRect(rect().adjusted(9, 9, -9, -9), Qt::black);
}
