// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "omoriprogressbar.h"

#include <QPainter>
#include <QTimer>
#include <qbrush.h>
#include <qmargins.h>
#include <qnamespace.h>
#include <qsize.h>

using namespace Qt::Literals::StringLiterals;

OmoriProgressBar::OmoriProgressBar(QWidget *parent) : QWidget(parent) {
    setSizePolicy(QSizePolicy::Expanding, QSizePolicy::Expanding);

    QSizePolicy sp = sizePolicy();
    sp.setHeightForWidth(true);
    setSizePolicy(sp);

    for (int v = 0; v < 2; v++) {
        for (int i = 1; i <= 10; i++) {
            m_frames[v][i - 1] = QPixmap(u":/contents/progress/%1%2.png"_s.arg(v ? "a" : "b").arg(i));
        }
    }
    m_pixmapSize = m_frames[0][0].size();

    variantTimer = new QTimer(this);
    variantTimer->start(230);
    connect(variantTimer, &QTimer::timeout, this, &OmoriProgressBar::updateVariant);
}

qreal OmoriProgressBar::value() const {
    return m_value;
}

void OmoriProgressBar::setValue(qreal value) {
    value = qBound(0.0, value, 1.0);
    if (qFuzzyCompare(m_value, value))
        return;
    m_value = value;
    update();
}

void OmoriProgressBar::updateVariant() {
    m_variant ^= 1;
    update();
}

int OmoriProgressBar::effectiveIndex() const {
    return qBound(0, qCeil(m_value * 10) - 1, 9);
}

QSize OmoriProgressBar::sizeHint() const {
    return m_pixmapSize;
}

QSize OmoriProgressBar::minimumSizeHint() const {
    return m_pixmapSize; // QSize(0, 0);
}

void OmoriProgressBar::resizeEvent(QResizeEvent *event) {
    QWidget::resizeEvent(event);
}

int OmoriProgressBar::heightForWidth(int w) const {
    if (m_pixmapSize.width() <= 0)
        return -1;
    const int innerW = qMax(0, w - 4);
    const int innerH = qRound(qreal(innerW) * m_pixmapSize.height() / m_pixmapSize.width());
    return innerH + 4;
}

void OmoriProgressBar::paintEvent(QPaintEvent *event) {
    Q_UNUSED(event)

    QPainter painter(this);
    painter.setRenderHint(QPainter::SmoothPixmapTransform, false);

    const QPixmap &frame = m_frames[m_variant][effectiveIndex()];
    if (frame.isNull())
        return;

    const QSize scaled = frame.size().scaled(size() - QSize(4, 4), Qt::KeepAspectRatio);
    const QPoint offset = QPoint((width() - scaled.width()) / 2, (height() - scaled.height()) / 2);

    painter.drawPixmap(QRect(offset, scaled), frame);
}
