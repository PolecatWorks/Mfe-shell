import { trigger, transition, style, query, animate, group } from '@angular/animations';

export const fadeAnimation = trigger('routeAnimations', [
    transition('* <=> *', [
        // Set up the container and elements
        query(
            ':enter, :leave',
            [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    opacity: 0,
                    transform: 'scale(0.98)',
                }),
            ],
            { optional: true }
        ),
        // Setup for leaving component
        query(
            ':leave',
            [
                style({ opacity: 1, transform: 'scale(1)' }),
            ],
            { optional: true }
        ),
        // Animate out leaving component and animate in entering component simultaneously
        group([
            query(
                ':leave',
                [
                    animate(
                        '200ms ease-out',
                        style({ opacity: 0, transform: 'scale(0.98)' })
                    ),
                ],
                { optional: true }
            ),
            query(
                ':enter',
                [
                    animate(
                        '300ms ease-in',
                        style({ opacity: 1, transform: 'scale(1)' })
                    ),
                ],
                { optional: true }
            ),
        ]),
    ]),
]);
