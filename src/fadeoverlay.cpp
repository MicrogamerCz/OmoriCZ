#include "fadeoverlay.h"

#include <QPainter>
#include <qpropertyanimation.h>

FadeOverlay::FadeOverlay(QWidget *parent) : QWidget(parent) {
    setAttribute(Qt::WA_TransparentForMouseEvents, true);

    m_opacityEffect = new QGraphicsOpacityEffect(this);
    m_opacityEffect->setOpacity(0.0);
    setGraphicsEffect(m_opacityEffect);

    m_fadeAnimation = new QPropertyAnimation(m_opacityEffect, "opacity", this);
    m_fadeAnimation->setDuration(2300);
    connect(m_fadeAnimation, &QPropertyAnimation::finished, this, [this] {
        if (isVisible())
            Q_EMIT fadeFinished();
    });
}

void FadeOverlay::setVisible(bool visible) {
    m_fadeAnimation->stop();

    if (visible) {
        QWidget::setVisible(true);
        m_fadeAnimation->setStartValue(m_opacityEffect->opacity());
        m_fadeAnimation->setEndValue(1.0);
        m_fadeAnimation->start();
    } else {
        m_opacityEffect->setOpacity(0.0);
        QWidget::setVisible(false);
    }
}

void FadeOverlay::paintEvent(QPaintEvent *event) {
    Q_UNUSED(event);
    QPainter painter(this);
    painter.fillRect(rect(), Qt::white);
}
